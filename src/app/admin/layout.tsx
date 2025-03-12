
export default function Page({ children }: { children: React.ReactNode }) {
    return <div className="p-6 bg-gray-50 min-h-screen">{children}</div>;
  }
  

  import Footer from "./_common/Footer";
  // import Sidebar from "./_common/Sidebar";
  // import Topbar from "./_common/Topbar";
  
  // export default function Page({ children }: { children: React.ReactNode }) {
  //     return (<div className="flex flex-col min-h-screen">
  //       <Topbar />
        
  //       <div className="flex flex-1">
  //         <Sidebar />
  //         <main className="flex-1 p-4">
  //           {children}
  //         </main>
  //       </div>
      
  //       <Footer />
  //     </div>)
  //   }
    