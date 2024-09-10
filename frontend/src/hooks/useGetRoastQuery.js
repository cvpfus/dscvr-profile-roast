import {useQuery} from "@tanstack/react-query";
import roastService from "../services/roast.js"

export const useGetRoastQuery = (username) => {
  return useQuery({
    queryKey: ["roast", username],
    queryFn: () => roastService.generateRoast(username),
    retry: false,
    refetchOnWindowFocus: false,
    enabled: false
  })
}