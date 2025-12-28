package parfumerie.parfilya.repositories.neo4j;

import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.neo4j.repository.query.Query;
import parfumerie.parfilya.models.neo4j.Brand;

import java.util.List;
import java.util.Optional;

public interface BrandRepository extends Neo4jRepository<Brand, String> {

    Optional<Brand> findByName(String name);

    @Query("MATCH (b:Brand)-[:PRODUCES]->(p:Product) WHERE p.mysqlProductId = $productId RETURN b")
    Optional<Brand> findBrandByProductId(Long productId);

    @Query("MATCH (b:Brand) RETURN b ORDER BY b.name")
    List<Brand> findAllOrderByName();

    @Query("MATCH (b:Brand {id: $brandId})-[:PRODUCES]->(p:Product) RETURN count(p)")
    int countProductsByBrand(String brandId);

    List<Brand> findByCountry(String country);

    @Query("MATCH (b:Brand {name: $brandName}), (p:Product {mysqlProductId: $productId}) " +
           "MERGE (b)-[:PRODUCES]->(p)")
    void linkProductToBrand(String brandName, Long productId);

    @Query("MATCH (b:Brand)-[r:PRODUCES]->(p:Product {mysqlProductId: $productId}) DELETE r")
    void unlinkProductFromBrand(Long productId);
}
