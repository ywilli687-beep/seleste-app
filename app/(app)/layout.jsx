import AppSidebar from '../../components/layout/AppSidebar';

export default function AppLayout({ children }) {
    return (
        <div className="flex min-h-screen bg-[#f4ebe1]">
            <AppSidebar />
            <div className="flex-1 overflow-x-hidden">
                {children}
            </div>
        </div>
    );
}
