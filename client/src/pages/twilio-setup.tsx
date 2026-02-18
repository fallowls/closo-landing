import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocation } from "wouter";

export default function TwilioSetup() {
  const [, setLocation] = useLocation();

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Twilio Setup</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-600">
              Twilio setup documentation is currently being consolidated for this build.
            </p>
            <Button onClick={() => setLocation("/dashboard")}>Back to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
