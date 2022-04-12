package vn.cmc.skillsheet.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import vn.cmc.skillsheet.dto.ChannelDto;
import vn.cmc.skillsheet.entity.Channel;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.ChannelRepository;
import vn.cmc.skillsheet.service.ChannelService;
import vn.cmc.skillsheet.vo.UpdateChannel;

import java.time.LocalDateTime;
import java.util.List;

/**
 * @author NDDUC
 *
 */
@Service
public class ChannelServiceImpl implements ChannelService {

    @Autowired
    private ChannelRepository channelRepository;

    @Override
    public ChannelDto getListChannel() {
        ChannelDto channelDto = new ChannelDto();
        List<Channel> channelList = channelRepository.findAll();

        channelDto.setChannellList(channelList);
        channelDto.setTotalElements(channelList.size());
        return channelDto;

    }

    @Override
    public Channel updateChannel(Channel channel, UpdateChannel updateChannel, Staff staff) {
        channel.setName(updateChannel.getName());
        channel.setUpdatedAt(LocalDateTime.now());

        channel.setUpdatedBy(staff.getUserName());

        return channelRepository.save(channel);
    }


}
