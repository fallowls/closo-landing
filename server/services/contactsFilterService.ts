import { readOnlyPool } from '../db';

// Filter templates for common sales use cases
export const FILTER_TEMPLATES = {
  'c-level-executives': {
    name: 'C-Level Executives',
    description: 'CEOs, CTOs, CFOs, and other C-suite executives',
    filters: [
      { column: 'title', operator: 'contains', value: 'CEO' },
      { column: 'title', operator: 'contains', value: 'CTO' },
      { column: 'title', operator: 'contains', value: 'CFO' },
      { column: 'title', operator: 'contains', value: 'COO' },
      { column: 'title', operator: 'contains', value: 'Chief' }
    ],
    combineWith: 'OR'
  },
  'vp-directors': {
    name: 'VPs & Directors',
    description: 'Vice Presidents and Directors',
    filters: [
      { column: 'title', operator: 'contains', value: 'VP' },
      { column: 'title', operator: 'contains', value: 'Vice President' },
      { column: 'title', operator: 'contains', value: 'Director' }
    ],
    combineWith: 'OR'
  },
  'enterprise-companies': {
    name: 'Enterprise Companies',
    description: 'Companies with 1000+ employees',
    filters: [
      { column: 'employees', operator: 'greater_or_equal', value: 1000 }
    ],
    combineWith: 'AND'
  },
  'mid-market': {
    name: 'Mid-Market Companies',
    description: 'Companies with 100-999 employees',
    filters: [
      { column: 'employees', operator: 'greater_or_equal', value: 100 },
      { column: 'employees', operator: 'less_than', value: 1000 }
    ],
    combineWith: 'AND'
  },
  'tech-industry': {
    name: 'Technology Industry',
    description: 'Companies in tech sector',
    filters: [
      { column: 'industry', operator: 'contains', value: 'Technology' },
      { column: 'industry', operator: 'contains', value: 'Software' },
      { column: 'industry', operator: 'contains', value: 'IT' }
    ],
    combineWith: 'OR'
  },
  'high-revenue': {
    name: 'High Revenue Companies',
    description: 'Companies with $10M+ annual revenue',
    filters: [
      { column: 'annual_revenue', operator: 'greater_or_equal', value: 10000000 }
    ],
    combineWith: 'AND'
  },
  'decision-makers': {
    name: 'Decision Makers',
    description: 'High-scoring leads with decision-making authority',
    filters: [
      { column: 'lead_score', operator: 'greater_or_equal', value: 70 },
      { column: 'title', operator: 'contains', value: 'Manager' },
      { column: 'title', operator: 'contains', value: 'Director' },
      { column: 'title', operator: 'contains', value: 'VP' },
      { column: 'title', operator: 'contains', value: 'Chief' }
    ],
    combineWith: 'OR' // OR for title filters
  }
};

export interface ContactFilter {
  column: string;
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'starts_with' | 'ends_with' | 
            'greater_than' | 'less_than' | 'greater_or_equal' | 'less_or_equal' | 
            'is_null' | 'is_not_null' | 'in' | 'not_in' | 'between';
  value?: any;
  value2?: any;
}

export interface ContactSearchQuery {
  filters: ContactFilter[];
  filterGroups?: Array<{
    filters: ContactFilter[];
    combineWith: 'AND' | 'OR';
  }>;
  globalSearch?: string; // Search across all text fields
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface ContactSearchResult {
  data: any[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
  aggregations?: {
    byIndustry?: Record<string, number>;
    byCountry?: Record<string, number>;
    byEmployeeSize?: Record<string, number>;
    avgLeadScore?: number;
  };
}

export interface FieldSuggestions {
  titles: string[];
  companies: string[];
  industries: string[];
  cities: string[];
  countries: string[];
  technologies: string[];
}

class ContactsFilterService {
  private validateIdentifier(identifier: string): boolean {
    return /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier);
  }

  private quoteIdentifier(identifier: string): string {
    if (!this.validateIdentifier(identifier)) {
      throw new Error(`Invalid identifier: ${identifier}`);
    }
    return `"${identifier}"`;
  }

  /**
   * Get field suggestions for autocomplete
   */
  async getFieldSuggestions(field: string, searchTerm: string = '', limit: number = 20): Promise<string[]> {
    const validFields = ['title', 'company', 'industry', 'city', 'country', 'state', 'business_type'];
    
    if (!validFields.includes(field)) {
      throw new Error('Invalid field for suggestions');
    }

    try {
      const query = `
        SELECT DISTINCT ${this.quoteIdentifier(field)} as value
        FROM contacts
        WHERE ${this.quoteIdentifier(field)} IS NOT NULL
          ${searchTerm ? `AND ${this.quoteIdentifier(field)} ILIKE $1` : ''}
          AND is_deleted = false
        ORDER BY value
        LIMIT $${searchTerm ? '2' : '1'}
      `;

      const result = await readOnlyPool.query(
        query,
        searchTerm ? [`%${searchTerm}%`, limit] : [limit]
      );

      return result.rows.map(row => row.value);
    } catch (error) {
      console.error(`Error getting suggestions for ${field}:`, error);
      return [];
    }
  }

  /**
   * Get aggregated field values for smart filters
   */
  async getFieldAggregations(): Promise<FieldSuggestions> {
    try {
      const [titles, companies, industries, cities, countries, technologies] = await Promise.all([
        this.getTopValues('title', 50),
        this.getTopValues('company', 100),
        this.getTopValues('industry', 30),
        this.getTopValues('city', 50),
        this.getTopValues('country', 50),
        this.getTopTechnologies(30)
      ]);

      return {
        titles,
        companies,
        industries,
        cities,
        countries,
        technologies
      };
    } catch (error) {
      console.error('Error getting field aggregations:', error);
      throw new Error('Failed to get field aggregations');
    }
  }

  private async getTopValues(field: string, limit: number): Promise<string[]> {
    const result = await readOnlyPool.query(`
      SELECT ${this.quoteIdentifier(field)}, COUNT(*) as count
      FROM contacts
      WHERE ${this.quoteIdentifier(field)} IS NOT NULL
        AND is_deleted = false
      GROUP BY ${this.quoteIdentifier(field)}
      ORDER BY count DESC
      LIMIT $1
    `, [limit]);

    return result.rows.map(row => row[field]);
  }

  private async getTopTechnologies(limit: number): Promise<string[]> {
    const result = await readOnlyPool.query(`
      SELECT UNNEST(technologies) as tech, COUNT(*) as count
      FROM contacts
      WHERE technologies IS NOT NULL
        AND is_deleted = false
      GROUP BY tech
      ORDER BY count DESC
      LIMIT $1
    `, [limit]);

    return result.rows.map(row => row.tech);
  }

  /**
   * Build a single filter condition
   */
  private buildSingleFilterCondition(
    filter: ContactFilter,
    paramIndex: number,
    values: any[]
  ): { condition: string | null; newParamIndex: number } {
    if (!this.validateIdentifier(filter.column)) {
      throw new Error(`Invalid column: ${filter.column}`);
    }

    const column = this.quoteIdentifier(filter.column);
    let condition: string | null = null;
    let newParamIndex = paramIndex;

    switch (filter.operator) {
      case 'equals':
        condition = `${column} = $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'not_equals':
        condition = `${column} != $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'contains':
        condition = `${column}::text ILIKE $${paramIndex}`;
        values.push(`%${filter.value}%`);
        newParamIndex++;
        break;

      case 'not_contains':
        condition = `${column}::text NOT ILIKE $${paramIndex}`;
        values.push(`%${filter.value}%`);
        newParamIndex++;
        break;

      case 'starts_with':
        condition = `${column}::text ILIKE $${paramIndex}`;
        values.push(`${filter.value}%`);
        newParamIndex++;
        break;

      case 'ends_with':
        condition = `${column}::text ILIKE $${paramIndex}`;
        values.push(`%${filter.value}`);
        newParamIndex++;
        break;

      case 'greater_than':
        condition = `${column} > $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'less_than':
        condition = `${column} < $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'greater_or_equal':
        condition = `${column} >= $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'less_or_equal':
        condition = `${column} <= $${paramIndex}`;
        values.push(filter.value);
        newParamIndex++;
        break;

      case 'is_null':
        condition = `${column} IS NULL`;
        break;

      case 'is_not_null':
        condition = `${column} IS NOT NULL`;
        break;

      case 'in':
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          const placeholders = filter.value.map((_, idx) => `$${paramIndex + idx}`).join(', ');
          condition = `${column} IN (${placeholders})`;
          values.push(...filter.value);
          newParamIndex += filter.value.length;
        }
        break;

      case 'not_in':
        if (Array.isArray(filter.value) && filter.value.length > 0) {
          const placeholders = filter.value.map((_, idx) => `$${paramIndex + idx}`).join(', ');
          condition = `${column} NOT IN (${placeholders})`;
          values.push(...filter.value);
          newParamIndex += filter.value.length;
        }
        break;

      case 'between':
        condition = `${column} BETWEEN $${paramIndex} AND $${paramIndex + 1}`;
        values.push(filter.value, filter.value2);
        newParamIndex += 2;
        break;
    }

    return { condition, newParamIndex };
  }

  /**
   * Build WHERE clause with support for global search and filter groups
   */
  private buildWhereClause(
    filters: ContactFilter[],
    filterGroups: Array<{ filters: ContactFilter[]; combineWith: 'AND' | 'OR' }> | undefined,
    globalSearch?: string
  ): { clause: string; values: any[] } {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Always exclude deleted contacts
    conditions.push('is_deleted = false');

    // Global search across multiple text fields
    if (globalSearch && globalSearch.trim()) {
      const searchFields = ['full_name', 'email', 'company', 'title', 'city', 'industry'];
      const searchConditions = searchFields.map(field => 
        `${this.quoteIdentifier(field)}::text ILIKE $${paramIndex}`
      );
      conditions.push(`(${searchConditions.join(' OR ')})`);
      values.push(`%${globalSearch.trim()}%`);
      paramIndex++;
    }

    // Handle filter groups (for templates with OR/AND logic)
    if (filterGroups && filterGroups.length > 0) {
      for (const group of filterGroups) {
        const groupConditions: string[] = [];
        
        for (const filter of group.filters) {
          const { condition, newParamIndex } = this.buildSingleFilterCondition(
            filter, 
            paramIndex, 
            values
          );
          if (condition) {
            groupConditions.push(condition);
            paramIndex = newParamIndex;
          }
        }
        
        if (groupConditions.length > 0) {
          const combiner = group.combineWith === 'OR' ? ' OR ' : ' AND ';
          conditions.push(`(${groupConditions.join(combiner)})`);
        }
      }
      
      return {
        clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
        values
      };
    }

    // Individual filters (legacy support)
    for (const filter of filters) {
      if (!this.validateIdentifier(filter.column)) {
        throw new Error(`Invalid column: ${filter.column}`);
      }

      const column = this.quoteIdentifier(filter.column);

      switch (filter.operator) {
        case 'equals':
          conditions.push(`${column} = $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'not_equals':
          conditions.push(`${column} != $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'contains':
          conditions.push(`${column}::text ILIKE $${paramIndex}`);
          values.push(`%${filter.value}%`);
          paramIndex++;
          break;

        case 'not_contains':
          conditions.push(`${column}::text NOT ILIKE $${paramIndex}`);
          values.push(`%${filter.value}%`);
          paramIndex++;
          break;

        case 'starts_with':
          conditions.push(`${column}::text ILIKE $${paramIndex}`);
          values.push(`${filter.value}%`);
          paramIndex++;
          break;

        case 'ends_with':
          conditions.push(`${column}::text ILIKE $${paramIndex}`);
          values.push(`%${filter.value}`);
          paramIndex++;
          break;

        case 'greater_than':
          conditions.push(`${column} > $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'less_than':
          conditions.push(`${column} < $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'greater_or_equal':
          conditions.push(`${column} >= $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'less_or_equal':
          conditions.push(`${column} <= $${paramIndex}`);
          values.push(filter.value);
          paramIndex++;
          break;

        case 'is_null':
          conditions.push(`${column} IS NULL`);
          break;

        case 'is_not_null':
          conditions.push(`${column} IS NOT NULL`);
          break;

        case 'in':
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            const placeholders = filter.value.map((_, idx) => `$${paramIndex + idx}`).join(', ');
            conditions.push(`${column} IN (${placeholders})`);
            values.push(...filter.value);
            paramIndex += filter.value.length;
          }
          break;

        case 'not_in':
          if (Array.isArray(filter.value) && filter.value.length > 0) {
            const placeholders = filter.value.map((_, idx) => `$${paramIndex + idx}`).join(', ');
            conditions.push(`${column} NOT IN (${placeholders})`);
            values.push(...filter.value);
            paramIndex += filter.value.length;
          }
          break;

        case 'between':
          conditions.push(`${column} BETWEEN $${paramIndex} AND $${paramIndex + 1}`);
          values.push(filter.value, filter.value2);
          paramIndex += 2;
          break;
      }
    }

    return {
      clause: conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '',
      values
    };
  }

  /**
   * Search contacts with advanced filtering
   */
  async search(query: ContactSearchQuery): Promise<ContactSearchResult> {
    const page = query.page || 1;
    const pageSize = Math.min(query.pageSize || 50, 500); // Max 500 results per page
    const offset = (page - 1) * pageSize;

    try {
      // Build WHERE clause
      const { clause: whereClause, values: whereValues } = this.buildWhereClause(
        query.filters,
        query.filterGroups,
        query.globalSearch
      );

      // Build ORDER BY clause
      const sortBy = query.sortBy && this.validateIdentifier(query.sortBy) 
        ? this.quoteIdentifier(query.sortBy)
        : '"lead_score"'; // Default sort by lead score
      const sortOrder = query.sortOrder === 'desc' ? 'DESC' : 'ASC';
      const orderByClause = `ORDER BY ${sortBy} ${sortOrder} NULLS LAST, id ASC`;

      // Get total count
      const countQuery = `SELECT COUNT(*) as count FROM contacts ${whereClause}`;
      const countResult = await readOnlyPool.query(countQuery, whereValues);
      const totalCount = parseInt(countResult.rows[0]?.count || '0');

      // Get paginated data
      const dataQuery = `
        SELECT 
          id, full_name, first_name, last_name, title, email, 
          mobile_phone, company, employees, employee_size_bracket,
          industry, website, annual_revenue, person_linkedin,
          city, state, country, lead_score, technologies,
          business_type, created_at, updated_at
        FROM contacts
        ${whereClause}
        ${orderByClause}
        LIMIT $${whereValues.length + 1} OFFSET $${whereValues.length + 2}
      `;
      
      const dataResult = await readOnlyPool.query(dataQuery, [...whereValues, pageSize, offset]);
      const totalPages = Math.ceil(totalCount / pageSize);

      // Get aggregations if there are results
      let aggregations = undefined;
      if (totalCount > 0 && query.filters.length === 0 && !query.globalSearch) {
        aggregations = await this.getAggregations(whereClause, whereValues);
      }

      return {
        data: dataResult.rows,
        totalCount,
        page,
        pageSize,
        totalPages,
        aggregations
      };
    } catch (error) {
      console.error('Error searching contacts:', error);
      throw new Error('Failed to search contacts');
    }
  }

  /**
   * Get aggregations for insights
   */
  private async getAggregations(whereClause: string, whereValues: any[]): Promise<any> {
    try {
      const [industryResult, countryResult, sizeResult, scoreResult] = await Promise.all([
        // Top 10 industries
        readOnlyPool.query(`
          SELECT industry, COUNT(*) as count
          FROM contacts
          ${whereClause}
          AND industry IS NOT NULL
          GROUP BY industry
          ORDER BY count DESC
          LIMIT 10
        `, whereValues),
        
        // Top 10 countries
        readOnlyPool.query(`
          SELECT country, COUNT(*) as count
          FROM contacts
          ${whereClause}
          AND country IS NOT NULL
          GROUP BY country
          ORDER BY count DESC
          LIMIT 10
        `, whereValues),
        
        // Employee size distribution
        readOnlyPool.query(`
          SELECT employee_size_bracket, COUNT(*) as count
          FROM contacts
          ${whereClause}
          AND employee_size_bracket IS NOT NULL
          GROUP BY employee_size_bracket
          ORDER BY count DESC
        `, whereValues),
        
        // Average lead score
        readOnlyPool.query(`
          SELECT AVG(lead_score) as avg_score
          FROM contacts
          ${whereClause}
          AND lead_score IS NOT NULL
        `, whereValues)
      ]);

      return {
        byIndustry: Object.fromEntries(industryResult.rows.map(r => [r.industry, parseInt(r.count)])),
        byCountry: Object.fromEntries(countryResult.rows.map(r => [r.country, parseInt(r.count)])),
        byEmployeeSize: Object.fromEntries(sizeResult.rows.map(r => [r.employee_size_bracket, parseInt(r.count)])),
        avgLeadScore: parseFloat(scoreResult.rows[0]?.avg_score || '0')
      };
    } catch (error) {
      console.error('Error getting aggregations:', error);
      return undefined;
    }
  }

  /**
   * Export contacts to CSV
   */
  async exportToCSV(query: ContactSearchQuery): Promise<string> {
    try {
      // Execute search without pagination (max 10,000 records)
      const result = await this.search({
        ...query,
        page: 1,
        pageSize: 10000
      });

      if (result.data.length === 0) {
        return '';
      }

      // Build CSV
      const headers = Object.keys(result.data[0]);
      const csvRows = [headers.join(',')];

      for (const row of result.data) {
        const values = headers.map(header => {
          const value = row[header];
          if (value === null || value === undefined) return '';
          
          // Handle arrays (technologies)
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`;
          }
          
          const stringValue = String(value);
          // Escape values containing comma, quote, or newline
          if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
            return `"${stringValue.replace(/"/g, '""')}"`;
          }
          return stringValue;
        });
        csvRows.push(values.join(','));
      }

      return csvRows.join('\n');
    } catch (error) {
      console.error('Error exporting contacts:', error);
      throw new Error('Failed to export contacts');
    }
  }

  /**
   * Get contact statistics
   */
  async getStatistics(): Promise<any> {
    try {
      const result = await readOnlyPool.query(`
        SELECT 
          COUNT(*) as total_contacts,
          COUNT(DISTINCT company) as total_companies,
          COUNT(DISTINCT industry) as total_industries,
          COUNT(DISTINCT country) as total_countries,
          AVG(lead_score) as avg_lead_score,
          COUNT(*) FILTER (WHERE lead_score >= 70) as high_score_leads,
          COUNT(*) FILTER (WHERE employees >= 1000) as enterprise_companies
        FROM contacts
        WHERE is_deleted = false
      `);

      return result.rows[0];
    } catch (error) {
      console.error('Error getting statistics:', error);
      throw new Error('Failed to get statistics');
    }
  }
}

export const contactsFilterService = new ContactsFilterService();
