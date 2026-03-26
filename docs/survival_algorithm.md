# Ecolution: Survival Engine v1.2 Algorithm

The Survival Engine evaluates new market entrants within the "Global Stack" ecosystem. It uses a multi-dimensional analysis to determine the probability of survival, acquisition, or failure.

## 1. Evaluation Dimensions

### A. Moat Density (0.0 - 1.0)
- **Technical Complexity**: Is the core technology difficult to replicate?
- **Network Effects**: Does the value increase with more users/nodes?
- **Switching Costs**: How painful is it for a customer to leave?
- **Data Advantage**: Does the company have proprietary access to critical training data or telemetry?

### B. Resource Velocity (0.0 - 1.0)
- **Founder/Team Credibility**: Does the leadership have a track record of building in this domain? (e.g., ex-OpenAI for Intelligence, ex-TSMC for Foundry).
- **Funding/Burn Ratio**: Is the initial funding sufficient for the inferred R&D cycle?
- **Team Density**: Is the team size optimal for the domain? (e.g., lean for SaaS, heavy for Foundries).
- **Compute Access**: For "Intelligence" and "Compute" domains, does the company have a path to H100s/TPUs?

### C. Predator Proximity
- **Big Tech Overlap**: How close is the product to the "free" or "integrated" offerings of AWS, Azure, Google, or Nvidia?
- **Acquisition Magnetism**: Is the company building a feature that a giant *needs* to complete their stack?

## 2. Gap Identification Logic

The "Gap" is defined as the primary delta between the current state and a >80% survival probability.

### Algorithm for Gap Selection:
1. **If Credibility Score < 0.5**:
   - *Gap*: "Execution Risk"
   - *Suggestion*: The team lacks the domain-specific "scar tissue" required for this territory. They must hire a veteran "Sherpa" (Advisor/CTO) who has survived a previous epoch in this specific domain.
2. **If Moat Density < 0.4**:
   - *Gap*: "Niche Pivot Required"
   - *Suggestion*: The company is too broad and will be crushed by generalist giants. It must find a vertical niche (e.g., AI for Legal, Cloud for BioTech) where the giants' scale is a disadvantage.
2. **If Funding < (Domain Average * 0.5)**:
   - *Gap*: "Capital Starvation"
   - *Suggestion*: The current funding is insufficient for the hardware or talent wars in this domain. A strategic bridge round or partnership with a Cloud provider is mandatory.
3. **If Predator Proximity > 0.8 AND Moat Density < 0.7**:
   - *Gap*: "Acquisition Trap"
   - *Suggestion*: The company is building a "feature, not a product." It should focus on interoperability or become so deeply integrated into a competitor's ecosystem that acquisition becomes the only logical exit.
4. **If Team Size > (Funding / $200k)**:
   - *Gap*: "Operational Bloat"
   - *Suggestion*: The burn rate is too high for the current runway. The entity must lean out and focus on core IP development before the next epoch.

## 3. The Suggestion Engine
The suggestion is a synthesis of the Gap Analysis, providing a tactical directive to the "Founder" to alter their evolutionary trajectory.
