import type { Metadata } from "next";
import { SectionHeading } from "@/components/common/section-heading";
import { StreamsGrid } from "@/components/esports/streams-grid";
import { getStreams, getStreamCategories } from "@/lib/server/stream-service";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Phát Trực Tiếp",
  description: "Xem trực tiếp và theo dõi các buổi phát sóng của cộng đồng SGM Network.",
};

export default async function EsportsPage() {
  const [streams, categories] = await Promise.all([
    getStreams().catch(() => []),
    getStreamCategories().catch(() => []),
  ]);

  return (
    <div className="space-y-8 pt-6 md:pt-8">
      <SectionHeading
        title="PHÁT TRỰC TIẾP"
        description="THEO DÕI CÁC BUỔI PHÁT TRỰC TIẾP VÀ SỰ KIỆN CỦA CỘNG ĐỒNG."
      />
      <StreamsGrid initialStreams={streams} categories={categories} />
    </div>
  );
}
