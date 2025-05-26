import pool from "@/db/db";
import { Adopter } from "@/db/models/adopter";

export async function GET(request: Request) {
  try {
    // Simple database connectivity check
    try {
      const testConnection = await pool.query('SELECT 1 as result');
    } catch (dbError) {
      console.error("Database connection failed:", dbError);
      return new Response(JSON.stringify({ 
        error: "Database connection failed", 
      }), {
        status: 503,
        headers: { "Content-Type": "application/json" },
      });
    }

    const url = new URL(request.url);
    const id_adopter = url.searchParams.get("id_adopter");
    
    console.log("GET /api/adopter - Started request processing");
    
    if (id_adopter) {
      // Get specific adopter
      const query = `
        SELECT 
          ad.id_adopter as id,
          ad.total_kontribusi,
          ad.username_adopter
        FROM adopter ad
        WHERE ad.id_adopter = $1
      `;
      
      const result = await pool.query(query, [id_adopter]);
      
      if (result.rows.length === 0) {
        return new Response(JSON.stringify({ error: "Adopter not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify(result.rows[0]), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } else {
      // Start with a super simple query to get basic adopter info
      const adopterQuery = `SELECT id_adopter as id, username_adopter, total_kontribusi FROM adopter`;
      const adopterResult = await pool.query(adopterQuery);
      
      // Now try to get individual adopter names
      const individualsQuery = `
        SELECT i.id_adopter, i.nama
        FROM individu i
      `;
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
      const orgsQuery = `
        SELECT o.id_adopter, o.nama_organisasi
        FROM organisasi o
      `;
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
      const adopters = adopterResult.rows.map(adopter => {
        const id = adopter.id;
        const name = individualNames[id] || orgNames[id] || adopter.username_adopter;
        const type = individualNames[id] ? 'individu' : (orgNames[id] ? 'organisasi' : null);
        
        return {
          ...adopter,
          name,
          type,
          address: '', // Default empty string for address
          contact: '', // Default empty string for contact
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name || 'Unknown')}&background=random`
        };
      });
      
      return new Response(JSON.stringify(adopters), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("Error fetching adopters:", error);
    return new Response(JSON.stringify({ 
      error: "Failed to fetch adopters", 
    }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    
    if (!id) {
      return new Response(JSON.stringify({ error: "Adopter ID is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
    
    // Start a transaction to ensure data consistency
    await pool.query('BEGIN');
    
    try {
      // Delete adopsi records first (due to foreign key constraints)
      await pool.query('DELETE FROM adopsi WHERE id_adopter = $1', [id]);
      
      // Delete individu or organisasi record
      await pool.query('DELETE FROM individu WHERE id_adopter = $1', [id]);
      await pool.query('DELETE FROM organisasi WHERE id_adopter = $1', [id]);
      
      // Finally delete the adopter record
      const adopterModel = new Adopter();
      const deleted = await adopterModel.delete("id_adopter", id);
      
      // Commit the transaction
      await pool.query('COMMIT');
      
      if (!deleted) {
        return new Response(JSON.stringify({ error: "Adopter not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      // Rollback transaction on error
      await pool.query('ROLLBACK');
      throw error;
    }
  } catch (error) {
    console.error("Error deleting adopter:", error);
    return new Response(JSON.stringify({ error: "Failed to delete adopter" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}