self.onmessage = function(event) {
    console.log('Worker received data:', event.data);

    const { allData, tenantData, selectedTenants, minGlaValue, maxGlaValue } = event.data;

    console.time('Filtering Time'); // Start timer

    // Filter tenant data by selected tenants
    let filteredComplexIds = new Set();
    if (selectedTenants.length > 0) {
        tenantData.forEach(tenant => {
            if (selectedTenants.includes(tenant.tenant_name)) {
                filteredComplexIds.add(tenant.complex_id);
            }
        });
    } else {
        // If no tenants are selected, consider all complexes
        filteredComplexIds = new Set(allData.map(item => item.complex_id));
    }

    // Filter allData based on GLA values and tenant selection
    const filteredData = allData.filter(item => {
        return filteredComplexIds.has(item.complex_id) &&
               item.raw_gla_sq_ft >= minGlaValue &&
               item.raw_gla_sq_ft <= maxGlaValue;
    });

    console.timeEnd('Filtering Time'); // End timer

    console.log('Worker finished filtering, returning data:', filteredData.length);
    self.postMessage(filteredData);
};
