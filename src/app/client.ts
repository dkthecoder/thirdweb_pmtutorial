import { createThirdwebClient } from "thirdweb";

export const Client = createThirdwebClient({
    clientId: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID as string,
});
