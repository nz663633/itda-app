package ITDA_backend.service;

import ITDA_backend.dto.RegionResponse;
import ITDA_backend.repository.RegionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository regionRepository;

    @Transactional(readOnly = true)
    public RegionResponse.ListResponse getRegions() {
        List<RegionResponse.Item> items = regionRepository.findAllByOrderByRegionIdAsc()
                .stream()
                .map(RegionResponse.Item::from)
                .toList();
        return new RegionResponse.ListResponse(items);
    }
}