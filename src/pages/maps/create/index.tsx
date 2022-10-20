import { AreaCreate } from "../../../types/area.schema";
import { trpc } from "../../../utils/trpc";
import { useForm } from "react-hook-form";

export default function Index() {
  const { handleSubmit, register } = useForm<AreaCreate>();

  

  const { mutate } = trpc.useMutation(["area.create"]);

  const onSubmit = (values : AreaCreate) => {
    mutate(values);
  };
  
  return <>
    <form onSubmit={handleSubmit(onSubmit)}>
      Location Name
      <input
        {...register("locationName")}
        type="text" />
    
      northEastLat
      <input 
        {...register("northEastLat", {valueAsNumber: true})}
      />

      northEastLong
      <input 
        {...register("northEastLong", {valueAsNumber: true})}
      />
      
      southWestLat
      <input 
        {...register("southWestLat", {valueAsNumber: true})}
      />
        
      southWestLong
      <input 
        {...register("southWestLong", {valueAsNumber: true})}
      />
    
      <button type="submit">Submit</button>
    </form>
  </>;
}
