// utils/statusColors.ts
export const statusColor = (status: string) => {
  switch (status) {
    case "pending":
      return "#FFA502";
    case "preparing":
      return "#0984E3";
    case "out_for_delivery":
      return "#6C5CE7";
    case "completed":
      return "#00B894";
    default:
      return "#999";
  }
};
