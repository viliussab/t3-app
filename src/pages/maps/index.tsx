import { trpc } from "../../utils/trpc";
import dynamic from "next/dynamic";
import { Area } from "@prisma/client";
import Layout from "./../../front/components/Layout";

const MapNoSSR = dynamic(() => import("../../front/components/_dynamic/StaticAreaMap"), {ssr: false});

const Index = () => {
  const {data, isLoading} = trpc.useQuery(["area.getAll"]);

  if (isLoading) return <>Loading</>;

  return (
    <Layout>
      <div className="flex flex-wrap">
        {data?.map(area => (
          <div className="m-8" key={area.id}>
            <AreaCard
              area={area} />
          </div>
        ))}
      </div>
    </Layout>
  );
};

type AreaCardProps = {
  area: Area,
}

const AreaCard = (props : AreaCardProps) => {
  const {
    area
  } = props;


  return <div className="rounded-2xl shadow-md hover:shadow-2xl ease-in-out duration-300 cursor-pointer ">
    <p className="text-xl text-center pt-4 pb-4">
      {area.locationName}
    </p>
    
    <div className="w-80 h-80">
      <MapNoSSR
        southWest={[area.southWestLat, area.southWestLong]}
        northEast={[area.northEastLat, area.northEastLong]}
      />
    </div>
  </div>;
};



export default Index;
