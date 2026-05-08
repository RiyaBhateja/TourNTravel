describe('TourNTravel EngineLogic Suite', function() {
    
    describe('calculateDailyBudget()', function() {
        it('should calculate correct daily budget for standard inputs', function() {
            expect(EngineLogic.calculateDailyBudget(1000, 5)).to.equal(200);
            expect(EngineLogic.calculateDailyBudget(4000, 14)).to.equal(286); // 285.71 rounded
        });

        it('should return 0 for invalid or zero maxBudget', function() {
            expect(EngineLogic.calculateDailyBudget(0, 5)).to.equal(0);
            expect(EngineLogic.calculateDailyBudget(null, 5)).to.equal(0);
        });

        it('should return 0 for invalid or zero days', function() {
            expect(EngineLogic.calculateDailyBudget(1000, 0)).to.equal(0);
            expect(EngineLogic.calculateDailyBudget(1000, null)).to.equal(0);
        });
    });

    describe('generateAlerts()', function() {
        it('should return default alerts if no constraints or styles match', function() {
            const alerts = EngineLogic.generateAlerts([], '');
            expect(alerts).to.be.an('array').with.lengthOf(2);
            expect(alerts[0].title).to.equal('High Tourist Traffic');
            expect(alerts[1].title).to.equal('Local Festival');
        });

        it('should generate Vegan Constraint alert when selected', function() {
            const alerts = EngineLogic.generateAlerts(['Vegan Options'], '');
            expect(alerts).to.have.lengthOf(3);
            const hasVegan = alerts.some(a => a.title === 'Constraint Met' && a.desc.includes('vegan'));
            expect(hasVegan).to.be.true;
        });

        it('should generate multiple alerts for stacked constraints', function() {
            const alerts = EngineLogic.generateAlerts(['VPN Friendly Networks', 'Strict Data Privacy'], 'Nomad');
            expect(alerts).to.have.lengthOf(5); // 2 defaults + 3 new
            const hasVPN = alerts.some(a => a.title === 'Cybersecurity Guard');
            const hasPrivacy = alerts.some(a => a.title === 'Privacy Notice');
            const hasWorkspace = alerts.some(a => a.title === 'Workspace Ready');
            expect(hasVPN).to.be.true;
            expect(hasPrivacy).to.be.true;
            expect(hasWorkspace).to.be.true;
        });
    });

});
