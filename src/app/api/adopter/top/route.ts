import pool from "@/db/db";

export async function GET() {
  try {
    // Start with basic adopter info
    const adopterQuery = `
      SELECT 
        ad.id_adopter as id, 
        ad.username_adopter, 
        ad.total_kontribusi
      FROM adopter ad
      ORDER BY ad.total_kontribusi DESC
      LIMIT 5
    `;
    
    const adopterResult = await pool.query(adopterQuery);
    
    // Try to get individual names
    const individualsQuery = `SELECT id_adopter, nama FROM individu`;
    let individualNames = {};
    try {
      const individualsResult = await pool.query(individualsQuery);
      individualNames = individualsResult.rows.reduce((acc, row) => {
        acc[row.id_adopter] = row.nama;
        return acc;
      }, {});
    } catch (error) {
      console.log("Error fetching individual names:");
    }
    
    // Try to get organization names
    const orgsQuery = `SELECT id_adopter, nama_organisasi FROM organisasi`;
    let orgNames = {};
    try {
      const orgsResult = await pool.query(orgsQuery);
      orgNames = orgsResult.rows.reduce((acc, row) => {
        acc[row.id_adopter] = row.nama_organisasi;
        return acc;
      }, {});
    } catch (error) {
      console.log("Error fetching organization names:");
    }
    
    // Combine the data
    const topAdopters = adopterResult.rows.map(adopter => {
      const id = adopter.id;
      const name = individualNames[id] || orgNames[id] || adopter.username_adopter;
      const type = individualNames[id] ? 'individu' : (orgNames[id] ? 'organisasi' : null);
      
      return {
        ...adopter,
        name,
        type,
        yearly_contribution: adopter.total_kontribusi, // Use total_kontribusi as yearly_contribution
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Unknown')}&background=random`
      };
    });
    
    return new Response(JSON.stringify(topAdopters), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching top adopters:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch top adopters",
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}