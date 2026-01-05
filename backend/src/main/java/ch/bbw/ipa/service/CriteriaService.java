package ch.bbw.ipa.service;

import ch.bbw.ipa.model.Criteria;
import ch.bbw.ipa.model.CriteriaResponse;
import ch.bbw.ipa.model.QualityLevels;
import ch.bbw.ipa.model.Requirement;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class CriteriaService {

    private final ObjectMapper objectMapper;

    public CriteriaService() {
        this.objectMapper = new ObjectMapper();
    }

    public CriteriaResponse loadCriteria() throws IOException {
        ClassPathResource resource = new ClassPathResource("criteria.json");
        InputStream inputStream = resource.getInputStream();
        
        Map<String, Object> jsonMap = objectMapper.readValue(inputStream, Map.class);
        List<Map<String, Object>> criteriaList = (List<Map<String, Object>>) jsonMap.get("criteria");
        
        List<Criteria> criteria = new ArrayList<>();
        
        for (Map<String, Object> criteriaMap : criteriaList) {
            Criteria criterion = new Criteria();
            criterion.setId((String) criteriaMap.get("id"));
            criterion.setTitle((String) criteriaMap.get("title"));
            criterion.setQuestion((String) criteriaMap.get("question"));
            
            List<Map<String, Object>> requirementsList = (List<Map<String, Object>>) criteriaMap.get("requirements");
            List<Requirement> requirements = new ArrayList<>();
            
            for (Map<String, Object> reqMap : requirementsList) {
                Requirement requirement = new Requirement();
                requirement.setId((String) reqMap.get("id"));
                requirement.setDescription((String) reqMap.get("description"));
                requirement.setModule((String) reqMap.get("module"));
                requirement.setPart((Integer) reqMap.get("part"));
                requirements.add(requirement);
            }
            
            criterion.setRequirements(requirements);
            
            Map<String, String> qualityLevelsMap = (Map<String, String>) criteriaMap.get("qualityLevels");
            QualityLevels qualityLevels = new QualityLevels();
            qualityLevels.setLevel0(qualityLevelsMap.get("0"));
            qualityLevels.setLevel1(qualityLevelsMap.get("1"));
            qualityLevels.setLevel2(qualityLevelsMap.get("2"));
            qualityLevels.setLevel3(qualityLevelsMap.get("3"));
            criterion.setQualityLevels(qualityLevels);
            
            criteria.add(criterion);
        }
        
        return new CriteriaResponse(criteria);
    }
}

