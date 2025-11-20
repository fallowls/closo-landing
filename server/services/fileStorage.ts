import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Readable } from 'stream';

export interface FileStorageConfig {
  type: 'local' | 's3';
  s3Config?: {
    region: string;
    accessKeyId: string;
    secretAccessKey: string;
    bucket: string;
  };
  localConfig?: {
    uploadDir: string;
  };
}

export interface StoredFile {
  path: string;
  key: string;
}

export interface FileToUpload {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export class FileStorageService {
  private config: FileStorageConfig;
  private s3Client?: S3Client;

  constructor(config?: Partial<FileStorageConfig>) {
    const storageType = (process.env.FILE_STORAGE || 'local') as 'local' | 's3';
    
    this.config = {
      type: storageType,
      s3Config: config?.s3Config || {
        region: process.env.AWS_REGION || 'us-east-1',
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        bucket: process.env.AWS_S3_BUCKET || '',
      },
      localConfig: config?.localConfig || {
        uploadDir: 'uploads',
      },
    };

    if (this.config.type === 's3' && this.config.s3Config) {
      this.s3Client = new S3Client({
        region: this.config.s3Config.region,
        credentials: {
          accessKeyId: this.config.s3Config.accessKeyId,
          secretAccessKey: this.config.s3Config.secretAccessKey,
        },
      });
    }
  }

  async uploadFile(file: Express.Multer.File): Promise<StoredFile> {
    if (this.config.type === 's3') {
      return this.uploadToS3(file);
    }
    return this.uploadLocally(file);
  }

  async getFile(fileKey: string): Promise<{ stream: Readable; filename: string; mimetype: string }> {
    if (this.config.type === 's3') {
      return this.getFromS3(fileKey);
    }
    return this.getLocally(fileKey);
  }

  async deleteFile(fileKey: string): Promise<void> {
    if (this.config.type === 's3') {
      return this.deleteFromS3(fileKey);
    }
    return this.deleteLocally(fileKey);
  }

  async fileExists(fileKey: string): Promise<boolean> {
    if (this.config.type === 's3') {
      return this.s3FileExists(fileKey);
    }
    return this.localFileExists(fileKey);
  }

  private async uploadToS3(file: Express.Multer.File): Promise<StoredFile> {
    if (!this.s3Client || !this.config.s3Config) {
      throw new Error('S3 client not configured');
    }

    const key = `uploads/${Date.now()}-${file.originalname}`;
    const fileBuffer = fs.readFileSync(file.path);

    const upload = new Upload({
      client: this.s3Client,
      params: {
        Bucket: this.config.s3Config.bucket,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype,
      },
    });

    await upload.done();

    fs.unlinkSync(file.path);

    return {
      path: `s3://${this.config.s3Config.bucket}/${key}`,
      key,
    };
  }

  private uploadLocally(file: Express.Multer.File): StoredFile {
    const uploadDir = this.config.localConfig?.uploadDir || 'uploads';
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = path.basename(file.path);
    const finalPath = path.join(uploadDir, filename);

    if (file.path !== finalPath && !fs.existsSync(finalPath)) {
      fs.renameSync(file.path, finalPath);
    }

    return {
      path: finalPath,
      key: filename,
    };
  }

  private async getFromS3(fileKey: string): Promise<{ stream: Readable; filename: string; mimetype: string }> {
    if (!this.s3Client || !this.config.s3Config) {
      throw new Error('S3 client not configured');
    }

    const command = new GetObjectCommand({
      Bucket: this.config.s3Config.bucket,
      Key: fileKey,
    });

    const response = await this.s3Client.send(command);

    if (!response.Body) {
      throw new Error('File not found in S3');
    }

    return {
      stream: response.Body as Readable,
      filename: path.basename(fileKey),
      mimetype: response.ContentType || 'application/octet-stream',
    };
  }

  private getLocally(fileKey: string): { stream: Readable; filename: string; mimetype: string } {
    const uploadDir = this.config.localConfig?.uploadDir || 'uploads';
    const filePath = path.join(uploadDir, fileKey);

    if (!fs.existsSync(filePath)) {
      throw new Error('File not found locally');
    }

    return {
      stream: fs.createReadStream(filePath),
      filename: path.basename(fileKey),
      mimetype: 'application/octet-stream',
    };
  }

  private async deleteFromS3(fileKey: string): Promise<void> {
    if (!this.s3Client || !this.config.s3Config) {
      throw new Error('S3 client not configured');
    }

    const command = new DeleteObjectCommand({
      Bucket: this.config.s3Config.bucket,
      Key: fileKey,
    });

    await this.s3Client.send(command);
  }

  private deleteLocally(fileKey: string): void {
    const uploadDir = this.config.localConfig?.uploadDir || 'uploads';
    const filePath = path.join(uploadDir, fileKey);

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }

  private async s3FileExists(fileKey: string): Promise<boolean> {
    if (!this.s3Client || !this.config.s3Config) {
      return false;
    }

    try {
      const command = new GetObjectCommand({
        Bucket: this.config.s3Config.bucket,
        Key: fileKey,
      });
      await this.s3Client.send(command);
      return true;
    } catch {
      return false;
    }
  }

  private localFileExists(fileKey: string): boolean {
    const uploadDir = this.config.localConfig?.uploadDir || 'uploads';
    const filePath = path.join(uploadDir, fileKey);
    return fs.existsSync(filePath);
  }

  getStorageType(): 'local' | 's3' {
    return this.config.type;
  }
}

export const fileStorage = new FileStorageService();
