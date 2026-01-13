
const projectEndpoint = `https://api.vercel.com/v9/projects/${process.env.VERCEL_PROJECT_ID}`;
const teamParams = process.env.VERCEL_TEAM_ID ? `?teamId=${process.env.VERCEL_TEAM_ID}` : "";

export const addDomainToVercel = async (domain: string) => {
    if (domain.includes("localhost")) return; // Skip for localhost

    console.log("🔍 Vercel API Config:", {
        id: process.env.VERCEL_PROJECT_ID,
        teamId: process.env.VERCEL_TEAM_ID,
        url: `${projectEndpoint}/domains${teamParams}`
    })

    const response = await fetch(
        `${projectEndpoint}/domains${teamParams}`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: domain,
                // Optional: redirect to www or vice versa, generic handling
            }),
        }
    );

    const data = await response.json();

    if (data.error) {
        console.error("❌ Vercel API Error:", JSON.stringify(data.error, null, 2))

        if (data.error.code === 'forbidden') {
            throw new Error("Permissão negada (Forbidden). 1. Use um 'Personal Token' (User Settings). 2. Verifique o Project ID (prj_...) e Team ID (team_...).")
        }
        if (data.error.code === 'domain_already_in_use') {
            throw new Error("Este domínio já está em uso por outro projeto.")
        }
        throw new Error(data.error.message);
    }

    return data;
};

export const removeDomainFromVercel = async (domain: string) => {
    if (domain.includes("localhost")) return;

    const response = await fetch(
        `${projectEndpoint}/domains/${domain}${teamParams}`,
        {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
            },
        }
    );

    return await response.json();
};

export const getDomainResponse = async (domain: string) => {
    return await fetch(
        `${projectEndpoint}/domains/${domain}${teamParams}`,
        {
            method: "GET",
            headers: {
                Authorization: `Bearer ${process.env.VERCEL_AUTH_TOKEN}`,
            },
        }
    ).then((res) => res.json());
};

export const getSubdomain = (name: string, apexName: string) => {
    if (name === apexName) return null;
    return name.slice(0, name.length - apexName.length - 1);
};

export const validDomainRegex = new RegExp(
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
);
