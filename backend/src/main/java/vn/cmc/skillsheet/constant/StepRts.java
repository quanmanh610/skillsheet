package vn.cmc.skillsheet.constant;

public enum StepRts {
    NONE("none", 0),
    QUALIFY("qualify", 1),
    CONFIRM("confirm", 2),
    INTERVIEW("interview", 3),
    OFFER("offer", 4),
    ONBOARD("onboard", 5),
    FAILED("failed" , 6)
    ;

    private final String name;
    private final int value;

    StepRts(String name, int value) {
        this.name = name;
        this.value = value;
    }

    public String getName() {
        return name;
    }

    public int getValue() {
        return value;
    }

    public static StepRts getValue(String name) {
        if (name == null) {
            return null;
        }
        for (StepRts step : values()) {
            if (step.name.equals(name)) {
                return step;
            }
        }
        return null;
    }
}
