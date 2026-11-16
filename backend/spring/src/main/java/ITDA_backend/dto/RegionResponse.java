package ITDA_backend.dto;

import ITDA_backend.entity.Region;
import java.util.List;

public class RegionResponse {

    public record Item(Integer regionId, String regionName) {
        public static Item from(Region region) {
            // 앱에는 짧은 이름("인천")을 region_name으로 보여줌
            return new Item(region.getRegionId(), region.getRegionShortName());
        }
    }

    public record ListResponse(List<Item> regions) {}
}