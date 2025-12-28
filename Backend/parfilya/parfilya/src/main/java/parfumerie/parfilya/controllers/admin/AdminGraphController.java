package parfumerie.parfilya.controllers.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import parfumerie.parfilya.models.neo4j.Category;
import parfumerie.parfilya.models.neo4j.ProductNode;
import parfumerie.parfilya.repositories.neo4j.CategoryRepository;
import parfumerie.parfilya.repositories.neo4j.ProductNodeRepository;

import java.util.*;

@RestController
@RequestMapping("/api/admin/graph")
public class AdminGraphController {

    private final CategoryRepository categoryRepository;
    private final ProductNodeRepository productNodeRepository;

    public AdminGraphController(CategoryRepository categoryRepository,
                                ProductNodeRepository productNodeRepository) {
        this.categoryRepository = categoryRepository;
        this.productNodeRepository = productNodeRepository;
    }

    /**
     * GET /api/admin/graph
     * Retourne les noeuds et relations pour visualisation
     */
    @GetMapping
    public ResponseEntity<Map<String, Object>> getGraphData() {
        Map<String, Object> result = new HashMap<>();
        List<Map<String, Object>> nodes = new ArrayList<>();
        List<Map<String, Object>> edges = new ArrayList<>();

        try {
            // Récupérer toutes les catégories avec leurs produits
            List<Category> categories = categoryRepository.findAll();

            int nodeId = 1;
            Map<String, Integer> categoryNodeIds = new HashMap<>();
            Map<Long, Integer> productNodeIds = new HashMap<>();

            // Ajouter les noeuds catégories
            for (Category category : categories) {
                Map<String, Object> node = new HashMap<>();
                node.put("id", nodeId);
                node.put("label", category.getName());
                node.put("type", "category");
                node.put("color", getCategoryColor(category.getName()));
                node.put("size", 30);
                nodes.add(node);
                categoryNodeIds.put(category.getId(), nodeId);
                nodeId++;

                // Ajouter les noeuds produits liés
                if (category.getProducts() != null) {
                    for (ProductNode product : category.getProducts()) {
                        if (!productNodeIds.containsKey(product.getMysqlProductId())) {
                            Map<String, Object> productNode = new HashMap<>();
                            productNode.put("id", nodeId);
                            productNode.put("label", product.getName());
                            productNode.put("type", "product");
                            productNode.put("color", "#4CAF50");
                            productNode.put("size", 15);
                            productNode.put("mysqlId", product.getMysqlProductId());
                            nodes.add(productNode);
                            productNodeIds.put(product.getMysqlProductId(), nodeId);
                            nodeId++;
                        }

                        // Ajouter la relation
                        Map<String, Object> edge = new HashMap<>();
                        edge.put("from", categoryNodeIds.get(category.getId()));
                        edge.put("to", productNodeIds.get(product.getMysqlProductId()));
                        edge.put("label", "HAS_PRODUCT");
                        edges.add(edge);
                    }
                }
            }

            // Ajouter les produits orphelins (sans catégorie)
            List<ProductNode> allProducts = productNodeRepository.findAll();
            for (ProductNode product : allProducts) {
                if (!productNodeIds.containsKey(product.getMysqlProductId())) {
                    Map<String, Object> productNode = new HashMap<>();
                    productNode.put("id", nodeId);
                    productNode.put("label", product.getName());
                    productNode.put("type", "product");
                    productNode.put("color", "#9E9E9E");
                    productNode.put("size", 15);
                    productNode.put("mysqlId", product.getMysqlProductId());
                    nodes.add(productNode);
                    nodeId++;
                }
            }

            result.put("nodes", nodes);
            result.put("edges", edges);
            result.put("stats", Map.of(
                "totalCategories", categories.size(),
                "totalProducts", allProducts.size(),
                "totalRelations", edges.size()
            ));

        } catch (Exception e) {
            result.put("error", e.getMessage());
            result.put("nodes", Collections.emptyList());
            result.put("edges", Collections.emptyList());
        }

        return ResponseEntity.ok(result);
    }

    private String getCategoryColor(String name) {
        return switch (name.toLowerCase()) {
            case "homme" -> "#2196F3";
            case "femme" -> "#E91E63";
            case "unisexe" -> "#9C27B0";
            case "luxe" -> "#FFD700";
            case "collection" -> "#FF9800";
            case "coffret" -> "#795548";
            default -> "#607D8B";
        };
    }
}
