package ITDA_backend.controller;

import ITDA_backend.dto.RegionResponse;
import ITDA_backend.service.RegionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @GetMapping("/api/regions")
    public RegionResponse.ListResponse getRegions() {
        return regionService.getRegions();
    }
}