import Sidebar from "@/components/layout/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen">
      <div className="fixed w-64 h-screen overflow-hidden">
        <Sidebar />
      </div>
      <div className="flex-1 ml-64 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}