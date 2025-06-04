import type React from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/common/components/ui/card";

export default function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="container max-w-[500px]">
        <CardHeader>
          <CardTitle className="text-3xl tracking-wide">ULLI</CardTitle>
          <CardDescription>AI 기반 상품 미리 입어보기</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
