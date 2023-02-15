import React from "react";
import * as Navigation from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";

interface SectionProps {
  name: string;
  items: Array<SectionItemProps>;
}

interface SectionItemProps {
  name: string;
  href: string;
}

const navigationSections: Array<SectionProps> = [
  {
    name: "Objektai",
    items: [
      {
        name: "Kurti objektą",
        href: "/billboards/add",
      },
      {
        name: "Objektų sąrašas",
        href: "/billboards",
      },
      {
        name: "Objektų žemėlapis",
        href: "/billboards/map",
      },
    ],
  },
  {
    name: "Kampanijos",
    items: [
      {
        name: "Kurti kampaniją",
        href: "/campaigns/add",
      },
      {
        name: "Kampanijų sąrašas",
        href: "/campaigns",
      },
      {
        name: "Kampanijų suvestinė",
        href: "/campaigns/summary",
      },
      {
        name: "Savaitinis registras",
        href: "/billboards/occupancy",
      },
      {
        name: "Klientai",
        href: "/customers",
      },
    ],
  },
  {
    name: "Ataskaitos",
    items: [
      {
        name: "Kabinimo planas",
        href: "/plan",
      },
    ],
  },
];

const Header = () => {
  return (
    <nav className="bg-gray-0 fixed top-0 right-0 z-50 flex h-12 w-full justify-end bg-white align-middle shadow hover:shadow-lg">
      <Navigation.Root>
        <Navigation.List className="mt-1 flex align-middle">
          {navigationSections.map((section) => (
            <Section {...section} key={section.name} />
          ))}
        </Navigation.List>
      </Navigation.Root>
    </nav>
  );
};

export default Header;

const Section = (props: SectionProps) => {
  const { name, items } = props;

  return (
    <Navigation.Item className="z-10 ml-2 rounded-2xl duration-500 hover:bg-gray-200">
      <Navigation.Trigger className="w-full  rounded-2xl pt-1 pb-1 pl-2 pr-2 text-lg duration-500 hover:decoration-4 ">
        {name}
      </Navigation.Trigger>
      <Navigation.Content className="z-50 mt-2">
        <div className="flex justify-center">
          <Separator.Root
            orientation="horizontal"
            className="mb-2 h-px w-full bg-gray-300 shadow-2xl"
          />
        </div>
        {items.map((item) => (
          <SectionItem {...item} key={item.href} />
        ))}
      </Navigation.Content>
    </Navigation.Item>
  );
};

const SectionItem = (props: SectionItemProps) => {
  const { name, href } = props;

  return (
    <Navigation.Link
      className="flex rounded-xl p-1 pr-4 pl-4 duration-300 hover:bg-gray-300 hover:font-semibold"
      href={href}
    >
      {name}
    </Navigation.Link>
  );
};
