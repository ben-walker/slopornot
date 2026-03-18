import { format } from "date-fns";
import { useGetSetsDate } from "src/api/generated";

function Game() {
  const today = format(new Date(), "yyyy-MM-dd");

  const { data } = useGetSetsDate(today);

  console.log(today, data);

  return <div />;
}

export { Game };
