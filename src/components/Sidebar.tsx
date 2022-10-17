import Link from "next/link";
import React from "react";
import {MdHome, MdMap} from "react-icons/md";
import {IconType} from "react-icons";

const sidebarLinks : Array<ItemProps> = [
  {
    name: "Home Page",
    href: "/",
    Icon: MdHome
  },
  {
    name: "Maps",
    href: "/maps",
    Icon: MdMap
  },
  {
    name: "Maps create",
    href: "/maps/create",
    Icon: MdMap
  }
];

const Sidebar = () => {
  return (
    <div >
      <ul className="">
        {sidebarLinks.map(Item)}
      </ul>
    </div>
  );
};

interface ItemProps {
    name: string;
    href: string;
    Icon: IconType;
}

const Item = (props: ItemProps) => {
  const {href, name, Icon} = props;

  return <Link href={href}>
    <li className="hover:bg-slate-300 cursor-pointer flex flex-row-reverse text-lg items-center pl-2 pr-2">
      <div className="ml-2">
        <Icon />
      </div>
      <div className="">
        {name}
      </div>
    </li>
  </Link>
  ;
};

export default Sidebar;
