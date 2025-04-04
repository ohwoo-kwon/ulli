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
          <CardTitle className="text-3xl tracking-wide">E.S.G Bite</CardTitle>
          <CardDescription>AI 기반 스마트 식단 분석 솔루션</CardDescription>
        </CardHeader>
        {children}
      </Card>
    </div>
  );
}
