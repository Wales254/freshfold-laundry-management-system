import { Chip } from "@mui/material";

function LoyaltyBadge({ spent }) {
  let label = "Bronze";
  let color = "default";

  if (spent >= 10000) {
    label = "Platinum";
    color = "secondary";
  } else if (spent >= 5000) {
    label = "Gold";
    color = "warning";
  } else if (spent >= 2000) {
    label = "Silver";
    color = "primary";
  }

  return (
    <Chip
      label={label}
      color={color}
      size="small"
      variant="filled"
    />
  );
}

export default LoyaltyBadge;