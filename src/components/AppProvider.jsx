import React, { createContext, useContext, useEffect, useState } from "react";

//使用Context API管理狀態
const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const [todo, setTodo] = useState([]);  //保存代辦事項(包含完成事項)
    const [done, setDone] = useState([]);  //保存完成事項(不包含待辦事項)，可以用來作為篩選todo中真正待辦事項的依據，或者作為能夠將事項劃上刪除線的依據
    const [listName, setListName] = useState("") //保存待辦事項清單名稱
    const [moveToEnd, setMoveToEnd] = useState(false);  //決定是否將完成事項全部移到待辦事項之下依序顯示

    //初始掛載後，嘗試尋找Browser中是否有暫存todo中是否有暫存todo/done
    useEffect(() => {
        const storedTodo = sessionStorage.getItem("storageTodo");
        const storedDone = sessionStorage.getItem("storageDone");
        const storedTitle = sessionStorage.getItem("storageTitle");
        const parseTitle = storedTitle ? JSON.parse(storedTitle) : null;
        if (storedTodo) {
            const parsedTodo = JSON.parse(storedTodo);
            if (Array.isArray(parsedTodo)) {
                setTodo(parsedTodo);
            }
        }
        if (storedDone) {
            const parsedDone = JSON.parse(storedDone);
            if (Array.isArray(parsedDone)) {
                setDone(parsedDone);
            }
        }
        if (parseTitle) {
            setListName(parseTitle);
        }
    }, []);


    //持久化保存todo/done/listName
    useEffect(() => {
        if (done.length > 0) {
            sessionStorage.setItem("storageDone", JSON.stringify(done));
        }
        else {
            sessionStorage.removeItem("storageDone")
        }
    }, [done])

    useEffect(() => {
        if (todo.length > 0) {
            sessionStorage.setItem("storageTodo", JSON.stringify(todo));
        }
        else {
            sessionStorage.removeItem("storageTodo");
        }
    }, [todo])
    useEffect(() => {
        if (listName) {
            sessionStorage.setItem("storageTitle", JSON.stringify(listName));
        }
        else {
            sessionStorage.removeItem("storageTitle");
        }
    }, [listName])


    return (
        <AppContext.Provider value={{
            todo, setTodo,
            done, setDone,
            listName, setListName,
            moveToEnd, setMoveToEnd,
        }}>
            {children}
        </AppContext.Provider>
    )
}

export const useAppContext = () => {
    return useContext(AppContext)
}