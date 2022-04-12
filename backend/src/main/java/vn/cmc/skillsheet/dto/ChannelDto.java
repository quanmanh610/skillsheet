package vn.cmc.skillsheet.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import vn.cmc.skillsheet.entity.Channel;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChannelDto {

    private Channel selectedChannel;

    private List<Channel> channellList;

    private String selectedChannelId;

    private long totalElements;
    
}
