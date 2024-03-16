const handleCityClick = (city: string, router: any) => {
    router.push(`/resultats?city=${city}`);
}

const handleAutoEcoleClick = (id: string, router: any) => {
    router.push(`/autoecole/${id}`);
}

export { handleCityClick, handleAutoEcoleClick }