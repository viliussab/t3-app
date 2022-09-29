import { MapCreate } from '../../types/maps.schema';
import { trpc } from './../../utils/trpc';
import { useForm } from "react-hook-form";

export default function Index() {
    const {handleSubmit} = useForm<MapCreate>();

    const { mutate } = trpc.useMutation(['maps.create'])

    const onSubmit = async (values : MapCreate) => {
        mutate(values);
    }
  
  return <>
    <form onSubmit={handleSubmit(onSubmit)}>
        <label>
            Location Name
            <input type="text" name="locationName" />
        </label>
    
        <label>
            nw_x
            <input type="text" name="northWest_longitude" />
        </label>

        <label>
            nw_y
            <input type="text" name="northWest_latitude" />
        </label>
        
        <label>
            se_x
            <input type="text" name="southEast_longitude" />
        </label>
        
        <label>
            se_y
            <input type="text" name="southEast_latitude" />
        </label>
    
        <button type="submit">Submit</button>
    </form>
  </>
}