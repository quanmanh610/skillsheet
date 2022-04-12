package vn.cmc.skillsheet.vo;

import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.util.List;

public class LoginRole implements Serializable {
    /**
     * 
     */
    private static final long serialVersionUID = 1240807571271156872L;
    private String name;
    private String key;
    private boolean enabled;
    private List<Object> permissions;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getKey() {
        return key;
    }

    public void setKey(String key) {
        this.key = key;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public List<Object> getPermissions() {
        return permissions;
    }

    public void setPermissions(List<Object> permissions) {
        this.permissions = permissions;
    }

}
