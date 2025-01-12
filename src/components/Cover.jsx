import React, { useEffect, useState } from "react";

function Cover() {
    const [open, setOpen] = useState(false);


    const handleOpenNote = () => {
        setOpen(true);
        setTimeout(() => {
            document.getElementById("cover").classList.add("hidden");
        }, 1400)
    }

    return (
        <div className={`absolute top-0 z-10 ${open ? "opacity-0" : "opacity-100"} transition-all duration-500 delay-[900ms]`}>
            <div id="cover" className={`relative w-[500px] bg-yellow-200 flex items-center justify-center cursor-pointer ${open ? "h-[0px]" : "h-[670px]"} transition-all duration-1000 group`}
                onClick={handleOpenNote}>
                <div className={`flex flex-col items-center justify-center ${open ? "opacity-0" : "opacity-100"} transition-all duration-200 delay-1000 `}>
                    <h1 className="text-red-500 text-3xl">Todo List</h1>
                    <p className="mb-4 text-red-500 text-sm">List down ! Don't forget it !</p>
                </div>
                <div className={`absolute z-30 -bottom-[20px] w-full h-[50px] bg-gradient-to-t from-yellow-400 to-yellow-200 group-hover:h-[60px] group-hover:bottom-0 transition-all duration-1000`}>
                    <div className={`absolute z-40 bottom-0 w-full bg-yellow-200 group-hover:h-[15px] transition-all duration-1000 ${open? "h-[700px]" : "h-[3px]"} `}
                        style={{boxShadow: "0px 6px 10px rgba(0, 0, 0, 0.2) "}}>
                    </div>
                </div>

            </div>
        </div>

    )
}

export default Cover;