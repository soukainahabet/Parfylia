package parfumerie.parfilya.controllers.admin;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import parfumerie.parfilya.models.neo4j.Brand;
import parfumerie.parfilya.models.neo4j.ProductNode;
import parfumerie.parfilya.repositories.neo4j.BrandRepository;
import parfumerie.parfilya.repositories.neo4j.ProductNodeRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin/brands")
public class AdminBrandController {

    private final BrandRepository brandRepository;
    private final ProductNodeRepository productNodeRepository;

    public AdminBrandController(BrandRepository brandRepository,
                                ProductNodeRepository productNodeRepository) {
        this.brandRepository = brandRepository;
        this.productNodeRepository = productNodeRepository;
    }

    /**
     * GET /api/admin/brands - Liste toutes les marques
     */
    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllBrands() {
        try {
            List<Brand> brands = brandRepository.findAllOrderByName();
            List<Map<String, Object>> result = brands.stream().map(brand -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", brand.getId());
                map.put("name", brand.getName());
                map.put("country", brand.getCountry());
                map.put("logoUrl", brand.getLogoUrl());
                int count = brandRepository.countProductsByBrand(brand.getId());
                map.put("productCount", count);
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }

    /**
     * GET /api/admin/brands/{id} - Détails d'une marque
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getBrandById(@PathVariable String id) {
        try {
            Optional<Brand> brand = brandRepository.findById(id);
            if (brand.isEmpty()) {
                return ResponseEntity.notFound().build();
            }
            Brand b = brand.get();
            Map<String, Object> result = new HashMap<>();
            result.put("id", b.getId());
            result.put("name", b.getName());
            result.put("country", b.getCountry());
            result.put("logoUrl", b.getLogoUrl());

            // Liste des produits de cette marque
            List<Map<String, Object>> products = new ArrayList<>();
            if (b.getProducts() != null) {
                for (ProductNode p : b.getProducts()) {
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
     * POST /api/admin/brands - Créer une marque
     */
    @PostMapping
    public ResponseEntity<?> createBrand(@RequestBody Map<String, String> request) {
        try {
            String name = request.get("name");
            String country = request.get("country");
            String logoUrl = request.get("logoUrl");

            if (name == null || name.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Le nom est requis"));
            }

            // Vérifier si la marque existe déjà
            if (brandRepository.findByName(name).isPresent()) {
                return ResponseEntity.badRequest().body(Map.of("error", "Une marque avec ce nom existe déjà"));
            }

            Brand brand = new Brand(name.trim(), country);
            brand.setLogoUrl(logoUrl);
            Brand saved = brandRepository.save(brand);

            Map<String, Object> result = new HashMap<>();
            result.put("id", saved.getId());
            result.put("name", saved.getName());
            result.put("country", saved.getCountry());
            result.put("logoUrl", saved.getLogoUrl());
            result.put("message", "Marque créée avec succès");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * PUT /api/admin/brands/{id} - Modifier une marque
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateBrand(@PathVariable String id, @RequestBody Map<String, String> request) {
        try {
            Optional<Brand> existing = brandRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            Brand brand = existing.get();

            if (request.containsKey("name") && request.get("name") != null) {
                String newName = request.get("name").trim();
                // Vérifier si le nouveau nom existe déjà pour une autre marque
                Optional<Brand> byName = brandRepository.findByName(newName);
                if (byName.isPresent() && !byName.get().getId().equals(id)) {
                    return ResponseEntity.badRequest().body(Map.of("error", "Une marque avec ce nom existe déjà"));
                }
                brand.setName(newName);
            }

            if (request.containsKey("country")) {
                brand.setCountry(request.get("country"));
            }

            if (request.containsKey("logoUrl")) {
                brand.setLogoUrl(request.get("logoUrl"));
            }

            Brand saved = brandRepository.save(brand);

            Map<String, Object> result = new HashMap<>();
            result.put("id", saved.getId());
            result.put("name", saved.getName());
            result.put("country", saved.getCountry());
            result.put("logoUrl", saved.getLogoUrl());
            result.put("message", "Marque modifiée avec succès");

            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/brands/{id} - Supprimer une marque
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBrand(@PathVariable String id) {
        try {
            Optional<Brand> existing = brandRepository.findById(id);
            if (existing.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            brandRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Marque supprimée avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * POST /api/admin/brands/{id}/link/{productId} - Lier un produit à une marque
     */
    @PostMapping("/{id}/link/{productId}")
    public ResponseEntity<?> linkProduct(@PathVariable String id, @PathVariable Long productId) {
        try {
            Optional<Brand> brand = brandRepository.findById(id);
            if (brand.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            // D'abord délier le produit de toute autre marque
            brandRepository.unlinkProductFromBrand(productId);
            // Puis lier à la nouvelle marque
            brandRepository.linkProductToBrand(brand.get().getName(), productId);
            return ResponseEntity.ok(Map.of("message", "Produit lié à la marque avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * DELETE /api/admin/brands/{id}/unlink/{productId} - Délier un produit d'une marque
     */
    @DeleteMapping("/{id}/unlink/{productId}")
    public ResponseEntity<?> unlinkProduct(@PathVariable String id, @PathVariable Long productId) {
        try {
            brandRepository.unlinkProductFromBrand(productId);
            return ResponseEntity.ok(Map.of("message", "Produit délié de la marque avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }
}
