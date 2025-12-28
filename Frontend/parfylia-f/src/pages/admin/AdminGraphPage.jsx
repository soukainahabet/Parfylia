import { useState, useEffect, useRef } from "react";
import { Network } from "vis-network";
import api from "../../utils/axiosConfig";

export default function AdminGraphPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState(null);
  const containerRef = useRef(null);
  const networkRef = useRef(null);

  useEffect(() => {
    loadGraph();
    return () => {
      if (networkRef.current) {
        networkRef.current.destroy();
      }
    };
  }, []);

  const loadGraph = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await api.get("/admin/graph");
      const data = response.data;

      if (data.error) {
        setError(data.error);
        return;
      }

      setStats(data.stats);

      // Transformer les données pour vis-network
      const nodes = data.nodes.map(node => ({
        id: node.id,
        label: node.label,
        color: {
          background: node.color,
          border: node.type === "category" ? "#333" : "#666",
          highlight: { background: node.color, border: "#000" }
        },
        size: node.size,
        font: {
          size: node.type === "category" ? 16 : 12,
          color: "#333",
          bold: node.type === "category"
        },
        shape: node.type === "category" ? "diamond" : "dot",
        title: `${node.type === "category" ? "Catégorie" : "Produit"}: ${node.label}`
      }));

      const edges = data.edges.map((edge, index) => ({
        id: index,
        from: edge.from,
        to: edge.to,
        arrows: "to",
        color: { color: "#999", highlight: "#333" },
        width: 1,
        smooth: { type: "curvedCW", roundness: 0.2 }
      }));

      // Options du graphe
      const options = {
        nodes: {
          borderWidth: 2,
          shadow: true
        },
        edges: {
          smooth: {
            type: "continuous"
          }
        },
        physics: {
          enabled: true,
          solver: "forceAtlas2Based",
          forceAtlas2Based: {
            gravitationalConstant: -50,
            centralGravity: 0.01,
            springLength: 150,
            springConstant: 0.08
          },
          stabilization: {
            enabled: true,
            iterations: 200
          }
        },
        interaction: {
          hover: true,
          tooltipDelay: 100,
          zoomView: true,
          dragView: true
        },
        layout: {
          improvedLayout: true
        }
      };

      // Créer le réseau
      if (containerRef.current) {
        networkRef.current = new Network(
          containerRef.current,
          { nodes, edges },
          options
        );

        networkRef.current.on("click", (params) => {
          if (params.nodes.length > 0) {
            const nodeId = params.nodes[0];
            const node = nodes.find(n => n.id === nodeId);
            if (node) {
              console.log("Node clicked:", node);
            }
          }
        });
      }

    } catch (err) {
      console.error("Error loading graph:", err);
      setError("Erreur lors du chargement du graphe: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale * 1.3 });
    }
  };

  const handleZoomOut = () => {
    if (networkRef.current) {
      const scale = networkRef.current.getScale();
      networkRef.current.moveTo({ scale: scale / 1.3 });
    }
  };

  const handleFit = () => {
    if (networkRef.current) {
      networkRef.current.fit();
    }
  };

  return (
    <div style={{ padding: "20px", height: "calc(100vh - 100px)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ margin: 0 }}>Graphe Neo4j - Catégories & Produits</h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={handleZoomIn}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Zoom +
          </button>
          <button
            onClick={handleZoomOut}
            style={{
              padding: "8px 16px",
              background: "#007bff",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Zoom -
          </button>
          <button
            onClick={handleFit}
            style={{
              padding: "8px 16px",
              background: "#28a745",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Ajuster
          </button>
          <button
            onClick={loadGraph}
            style={{
              padding: "8px 16px",
              background: "#6f42c1",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Actualiser
          </button>
        </div>
      </div>

      {stats && (
        <div style={{
          display: "flex",
          gap: "20px",
          marginBottom: "15px",
          padding: "15px",
          background: "#f8f9fa",
          borderRadius: "8px"
        }}>
          <div>
            <strong style={{ color: "#E91E63" }}>Catégories:</strong> {stats.totalCategories}
          </div>
          <div>
            <strong style={{ color: "#4CAF50" }}>Produits:</strong> {stats.totalProducts}
          </div>
          <div>
            <strong style={{ color: "#FF9800" }}>Relations:</strong> {stats.totalRelations}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", gap: "15px", fontSize: "14px" }}>
            <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#2196F3", borderRadius: "2px", marginRight: "5px" }}></span>Homme</span>
            <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#E91E63", borderRadius: "2px", marginRight: "5px" }}></span>Femme</span>
            <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#9C27B0", borderRadius: "2px", marginRight: "5px" }}></span>Unisexe</span>
            <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#FFD700", borderRadius: "2px", marginRight: "5px" }}></span>Luxe</span>
            <span><span style={{ display: "inline-block", width: "12px", height: "12px", background: "#4CAF50", borderRadius: "50%", marginRight: "5px" }}></span>Produit</span>
          </div>
        </div>
      )}

      {error && (
        <div style={{
          padding: "20px",
          background: "#f8d7da",
          color: "#721c24",
          borderRadius: "8px",
          marginBottom: "15px"
        }}>
          <h3 style={{ margin: "0 0 10px 0" }}>Erreur de connexion Neo4j</h3>
          <p style={{ margin: "0 0 15px 0" }}>{error}</p>
          <div style={{ background: "#fff", padding: "15px", borderRadius: "5px", fontSize: "14px" }}>
            <strong>Pour résoudre ce problème :</strong>
            <ol style={{ margin: "10px 0 0 0", paddingLeft: "20px" }}>
              <li>Vérifiez que Neo4j est installé sur votre machine</li>
              <li>Démarrez Neo4j Desktop ou le service Neo4j</li>
              <li>Assurez-vous que la base de données est active sur le port 7687</li>
              <li>Cliquez sur "Actualiser" une fois Neo4j démarré</li>
            </ol>
            <p style={{ marginTop: "15px", marginBottom: "0" }}>
              <strong>Configuration attendue :</strong> neo4j://127.0.0.1:7687 (user: neo4j)
            </p>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "400px",
          background: "#f8f9fa",
          borderRadius: "8px"
        }}>
          <div>Chargement du graphe...</div>
        </div>
      ) : (
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "calc(100% - 120px)",
            border: "1px solid #ddd",
            borderRadius: "8px",
            background: "#fff"
          }}
        />
      )}

      <div style={{
        marginTop: "15px",
        padding: "10px",
        background: "#e9ecef",
        borderRadius: "5px",
        fontSize: "13px",
        color: "#666"
      }}>
        <strong>Astuce:</strong> Glissez pour déplacer les noeuds, utilisez la molette pour zoomer, cliquez sur un noeud pour plus de détails.
      </div>
    </div>
  );
}
