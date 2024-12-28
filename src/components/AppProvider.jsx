import React, { createContext, useContext, useEffect, useState } from "react";

//使用Context API管理全局狀態
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    //保存所有事項清單內容(hint: todo保存待辦/完成事項； done只保存完成事項)
    const [tasks, setTasks] = useState(sessionStorage.getItem("storedTasks")?
        JSON.parse(sessionStorage.getItem("storedTasks"))
        : 
        {
            page1: { name: "Untitle List-1", todo: [], done: [] },
            page2: { name: "Untitle List-2", todo: [], done: [] },
            page3: { name: "Untitle List-3", todo: [], done: [] }
        });
    //決定是否將完成事項全部移到待辦事項之下依序顯示之依據
    const [moveToEnd, setMoveToEnd] = useState(false);
    //保存清單分頁編號作為切換顯示事項清單的依據
    const [page, setPage] = useState("page1"); 
    

    //持久化保存tasks
    useEffect(() => {
        console.log("tasks:", tasks);
        sessionStorage.setItem("storedTasks", JSON.stringify(tasks));
    }, [tasks])


    return (
        <AppContext.Provider value={{
            tasks, setTasks,
            moveToEnd, setMoveToEnd,
            page, setPage,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}