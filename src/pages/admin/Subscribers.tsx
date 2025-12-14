import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Users } from "lucide-react";
import { format } from "date-fns";
import { toast } from "@/hooks/use-toast";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  unsubscribed: boolean;
}

const Subscribers = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  const fetchSubscribers = async () => {
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to load subscribers",
        variant: "destructive",
      });
    } else {
      setSubscribers(data || []);
    }
    setLoading(false);
  };

  const exportToCSV = () => {
    if (subscribers.length === 0) {
      toast({
        title: "No data",
        description: "No subscribers to export",
        variant: "destructive",
      });
      return;
    }

    const headers = ["Email", "Subscribed At", "Status"];
    const csvContent = [
      headers.join(","),
      ...subscribers.map((sub) =>
        [
          sub.email,
          format(new Date(sub.subscribed_at), "yyyy-MM-dd HH:mm:ss"),
          sub.unsubscribed ? "Unsubscribed" : "Active",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `subscribers_${format(new Date(), "yyyy-MM-dd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export complete",
      description: `Exported ${subscribers.length} subscribers`,
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Newsletter Subscribers</h1>
          <p className="text-muted-foreground">Manage your email subscribers</p>
        </div>
        <Button onClick={exportToCSV}>
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div>
            <CardTitle>All Subscribers</CardTitle>
            <CardDescription>Total: {subscribers.length} subscribers</CardDescription>
          </div>
          <Users className="h-5 w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {subscribers.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No subscribers yet</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Subscribed At</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {subscribers.map((subscriber) => (
                  <TableRow key={subscriber.id}>
                    <TableCell className="font-medium">{subscriber.email}</TableCell>
                    <TableCell>
                      {format(new Date(subscriber.subscribed_at), "MMM d, yyyy h:mm a")}
                    </TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          subscriber.unsubscribed
                            ? "bg-destructive/10 text-destructive"
                            : "bg-primary/10 text-primary"
                        }`}
                      >
                        {subscriber.unsubscribed ? "Unsubscribed" : "Active"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Subscribers;
