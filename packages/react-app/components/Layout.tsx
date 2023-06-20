import { FC, ReactNode, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Profile from "./Profile";

interface Props {
    children: ReactNode
}
const Layout: FC<Props> = ({children}) => {
    const [visible, setVisible] = useState(false);
    // function to change profile view
    const setProfile = (data:any) => {
        console.log(data);
        const {isProfile} = data;
        console.log(isProfile);
        setVisible(isProfile);
    }
    return (
        <>
            <div className="bg-gypsum overflow-hidden flex flex-col min-h-screen">
            <Header profile={setProfile} />
            {visible ? (
                <Profile />
            ):(
                <div className="py-16 max-w-7xl mx-auto space-y-8 sm:px-6 lg:px-8">
                    {children}
                </div>
            )}
            <Footer />
            </div>
        </>
    )
}

export default Layout;