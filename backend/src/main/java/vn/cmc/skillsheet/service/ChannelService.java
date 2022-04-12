package vn.cmc.skillsheet.service;

import vn.cmc.skillsheet.dto.ChannelDto;
import vn.cmc.skillsheet.entity.Channel;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.vo.UpdateChannel;

public interface ChannelService {

    public ChannelDto getListChannel();

    public Channel updateChannel(Channel channel, UpdateChannel updateChannel, Staff staff);
}
