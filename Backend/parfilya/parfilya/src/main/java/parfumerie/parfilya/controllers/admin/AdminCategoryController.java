package parfumerie.parfilya.controllers.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import parfumerie.parfilya.models.neo4j.Category;
import parfumerie.parfilya.models.neo4j.ProductNode;
import parfumerie.parfilya.repositories.neo4j.CategoryRepository;
import parfumerie.parfilya.repositories.neo4j.ProductNodeRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/categories")
public class AdminCategoryController {

    private final CategoryRepository categoryRepository;
    private final ProductNodeRepository productNodeRepository;

    public AdminCategoryController(CategoryRepository categoryRepository,
                                   ProductNodeRepository productNodeRepository) {
        this.categoryRepository = categoryRepository;
        this.productNodeRepository = productNodeRepository;
    }

    /**
     * GET /api/admin/categories - Liste toutes les catégories
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllCategories() {
        try {
            List<Category> categories = categoryRepository.findAllOrderByName();
            List<Map<String, Object>> result = categories.stream().map(cat -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", cat.getId());
                map.put("name", cat.getName());
                map.put("description", cat.getDescription());
                // Utiliser la requête de comptage directe
                int count = categoryRepository.countProductsByCategory(cat.getId());
                map.put("productCount", count);
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * GET /api/admin/categories/{id} - Détails d'une catégorie
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCategoryById(@PathVariable String id) {
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Category cat = category.get();
            Map<String, Object> result = new HashMap<>();
            result.put("id", cat.getId());
            result.put("name", cat.getName());
            result.put("description", cat.getDescription());

            // Liste des produits dans cette catégorie
            List<Map<String, Object>> products = new ArrayList<>();
            if (cat.getProducts() != null) {
                for (ProductNode p : cat.getProducts()) {
                    Map<String, Object> prod = new HashMap<>();
                    prod.put("id", p.getId());
                    prod.put("mysqlId", p.getMysqlProductId());
                    prod.put("name", p.getName());
                    products.add(prod);
                }
            }
            result.put("products", products);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/categories - Créer une catégorie
     */
    @PostMapping
    public ResponseEntity<?> createCategory(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String description = request.get("description");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le nom est requis"));
            }

            // Vérifier si la catégorie existe déjà
            if (categoryRepository.findByName(name).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Une catégorie avec ce nom existe déjà"));
            }

            Category category = new Category(name.trim(), description);
            Category saved = categoryRepository.save(category);

            Map<String, Object> result = new HashMap<>();
            result.put("id", saved.getId());
            result.put("name", saved.getName());
            result.put("description", saved.getDescription());
            result.put("message", "Catégorie créée avec succès");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/admin/categories/{id} - Modifier une catégorie
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCategory(@PathVariable String id, @RequestBody Map<String, String> request) {
        try {
            Optional<Category> existing = categoryRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Category category = existing.get();

            if (request.containsKey("name") && request.get("name") != null) {
                String newName = request.get("name").trim();
                // Vérifier si le nouveau nom existe déjà pour une autre catégorie
                Optional<Category> byName = categoryRepository.findByName(newName);
                if (byName.isPresent() && !byName.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Une catégorie avec ce nom existe déjà"));
                }
                category.setName(newName);
            }

            if (request.containsKey("description")) {
                category.setDescription(request.get("description"));
            }

            Category saved = categoryRepository.save(category);

            Map<String, Object> result = new HashMap<>();
            result.put("id", saved.getId());
            result.put("name", saved.getName());
            result.put("description", saved.getDescription());
            result.put("message", "Catégorie modifiée avec succès");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/categories/{id} - Supprimer une catégorie
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCategory(@PathVariable String id) {
        try {
            Optional<Category> existing = categoryRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            categoryRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Catégorie supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/categories/{id}/link/{productId} - Lier un produit à une catégorie
     */
    @PostMapping("/{id}/link/{productId}")
    public ResponseEntity<?> linkProduct(@PathVariable String id, @PathVariable Long productId) {
        try {
            Optional<Category> category = categoryRepository.findById(id);
            if (category.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            categoryRepository.linkProductToCategory(category.get().getName(), productId);
            return ResponseEntity.ok(Map.of("message", "Produit lié à la catégorie avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/categories/{id}/unlink/{productId} - Délier un produit d'une catégorie
     */
    @DeleteMapping("/{id}/unlink/{productId}")
    public ResponseEntity<?> unlinkProduct(@PathVariable String id, @PathVariable Long productId) {
        try {
            categoryRepository.unlinkProductFromCategoryById(id, productId);
            return ResponseEntity.ok(Map.of("message", "Produit délié de la catégorie avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
