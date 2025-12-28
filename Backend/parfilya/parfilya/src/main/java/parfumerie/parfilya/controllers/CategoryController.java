package parfumerie.parfilya.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import parfumerie.parfilya.models.neo4j.Category;
import parfumerie.parfilya.models.neo4j.Brand;
import parfumerie.parfilya.models.neo4j.ProductNode;
import parfumerie.parfilya.repositories.neo4j.CategoryRepository;
import parfumerie.parfilya.repositories.neo4j.BrandRepository;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository categoryRepository;
    private final BrandRepository brandRepository;

    public CategoryController(CategoryRepository categoryRepository,
                              BrandRepository brandRepository) {
        this.categoryRepository = categoryRepository;
        this.brandRepository = brandRepository;
    }

    /**
     * GET /api/categories - Liste publique des catégories
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
     * GET /api/categories/{name}/products - Produits d'une catégorie
     */
    @GetMapping("/{name}/products")
    public ResponseEntity<?> getProductsByCategory(@PathVariable String name) {
        try {
            Optional<Category> category = categoryRepository.findByName(name);
            if (category.isEmpty()) {
                return ResponseEntity.notFound().build();
            }

            List<Long> productIds = new ArrayList<>();
            if (category.get().getProducts() != null) {
                for (ProductNode p : category.get().getProducts()) {
                    productIds.add(p.getMysqlProductId());
                }
            }

            Map<String, Object> result = new HashMap<>();
            result.put("category", name);
            result.put("productIds", productIds);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * GET /api/brands - Liste publique des marques
     */
    @GetMapping("/brands")
    public ResponseEntity<List<Map<String, Object>>> getAllBrands() {
        try {
            List<Brand> brands = brandRepository.findAllOrderByName();
            List<Map<String, Object>> result = brands.stream().map(brand -> {
                Map<String, Object> map = new HashMap<>();
                map.put("id", brand.getId());
                map.put("name", brand.getName());
                map.put("country", brand.getCountry());
                map.put("logoUrl", brand.getLogoUrl());
                map.put("productCount", brand.getProducts() != null ? brand.getProducts().size() : 0);
                return map;
            }).collect(Collectors.toList());
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            return ResponseEntity.ok(Collections.emptyList());
        }
    }
}
