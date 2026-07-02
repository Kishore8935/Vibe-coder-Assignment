import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <Layout title="Page not found">
      <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed py-16 text-center text-muted-foreground">
        <p className="text-5xl font-semibold text-foreground">404</p>
        <p>We couldn&apos;t find the page you&apos;re looking for.</p>
        <Button asChild size="sm">
          <Link to="/">Back to search</Link>
        </Button>
      </div>
    </Layout>
  );
}
