import React from "react";
import * as Navigation from "@radix-ui/react-navigation-menu";
import * as Separator from "@radix-ui/react-separator";

const navigationSections : Array<SectionProps> = [
  {
    name: "Objektai",
    items: [
      {
        name: "Kurti objektą",
        href: "/billboards/add"
      }, 
      {
        name: "Objektų sąrašas",
        href: "/billboards"
      },
      {
        name: "Objektų žemėlapis",
        href: "/billboards/map"
      }
    ]
  },
  {
    name: "Kampanijos",
    items: [
      {
        name: "Kurti kampaniją",
        href: "/campaigns/add"
      },
      {
        name: "Kampanijų sąrašas",
        href: "/campaigns"
      },
      {
        name: "Kampanijų suvestinė",
        href: "/campaigns/occupancy"
      },
      {
        name: "Savaitinis registras",
        href: "/billboards/occupancy"
      },
      {
        name: "Klientai",
        href: "/clients"
      }
    ]
  },
  {
    name: "Ataskaitos",
    items: [ {
      name: "Kabinimo planas",
      href: "/plan"
    }]
  }
];

const Header = () => {
  return (
    <nav className="w-screen h-12 shadow hover:shadow-lg bg-gray-0 flex align-middle justify-end">
      <Navigation.Root>
        <Navigation.List className="flex align-middle mt-1">
          {navigationSections.map(section =>
            <Section {...section} key={section.name} />
          )}
        </Navigation.List>
      </Navigation.Root>
    </nav>
  );
};

export default Header;

const Section = (props: SectionProps) => {
  const {name, items} = props;

  return (
    <Navigation.Item className="duration-500 ml-2 hover:bg-gray-200 rounded-2xl z-10">
      <Navigation.Trigger className="duration-500  hover:decoration-4 rounded-2xl text-lg pt-1 pb-1 pl-2 pr-2 w-full ">
        {name}
      </Navigation.Trigger>
      <Navigation.Content className="mt-2 z-50">
        <div className="flex justify-center">
          <Separator.Root orientation="horizontal" className="bg-gray-300 w-full h-px mb-2 shadow-2xl"/>
        </div>
        {items.map(item => <SectionItem {...item} key={item.href} />)}
      </Navigation.Content>
    </Navigation.Item>
  );
};

const SectionItem = (props: SectionItemProps) => {
  const { name, href } = props;

  return (
    <Navigation.Link className="flex p-1 pr-4 pl-4 rounded-xl hover:font-semibold hover:bg-gray-300 duration-300" href={href}>
      {name}
    </Navigation.Link>
  );
};

interface SectionProps {
  name: string;
  items: Array<SectionItemProps>
}

interface SectionItemProps {
  name: string;
  href: string;
}
