import React from "react";
import * as FaIcons from "react-icons/fa";
import * as AiIcons from "react-icons/ai";
import * as IoIcons from "react-icons/io";

export const SidebarData = [
  {
    title: "หน้าหลัก",
    path: "/home",
    icon: <AiIcons.AiFillHome />,
    cName: "nav-text",
  },
  {
    title: "รายการแจ้งซ่อมทั้งหมด",
    path: "/request",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "กำล้งดำเนินการ",
    path: "/process",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  },
  {
    title: "ดำเนินการเสร็จสิ้น",
    path: "/success",
    icon: <IoIcons.IoIosPaper />,
    cName: "nav-text",
  }
];