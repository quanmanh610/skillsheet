package vn.cmc.skillsheet.controller;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import vn.cmc.skillsheet.dto.ChannelDto;
import vn.cmc.skillsheet.entity.Channel;
import vn.cmc.skillsheet.entity.Staff;
import vn.cmc.skillsheet.repository.ChannelRepository;
import vn.cmc.skillsheet.repository.StaffRepository;
import vn.cmc.skillsheet.service.ChannelService;
import vn.cmc.skillsheet.util.Messages;
import vn.cmc.skillsheet.util.ModelMapperUtils;
import vn.cmc.skillsheet.util.RoleUtil;
import vn.cmc.skillsheet.util.StringUtils;
import vn.cmc.skillsheet.vo.*;

import java.time.LocalDateTime;
import java.util.Optional;

@Controller
public class ChannelController {
    @Autowired
    private ChannelService channelService;

    @Autowired
	private ChannelRepository channelRepository;

    @Autowired
    private StaffRepository staffRepository;

    @RequestMapping(value = { "/api/setting/getChannelList" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getChannelList(@RequestHeader (HttpHeaders.AUTHORIZATION) String token) {

        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);

        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
		}

        if (!RoleUtil.canViewProfileList(staff)) {
        	return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        ChannelDto cvPullDto = channelService.getListChannel();
        return new ResponseEntity<>(cvPullDto, HttpStatus.OK);
    }

    @RequestMapping(value = { "/api/setting/getChannelById" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> getChannelById(@RequestBody String object,@RequestHeader (HttpHeaders.AUTHORIZATION) String token) {
        JSONObject obj = new JSONObject(object);
        int channelId = obj.getInt("channelId");
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);

        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!RoleUtil.canViewProfileList(staff)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        Optional<Channel> channel = channelRepository.findById(channelId);
        if (channel.isPresent()) {
            return new ResponseEntity<>(channel.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Channel not found"), HttpStatus.OK);
        }
    }

    @RequestMapping(value = { "/api/setting/addChannel" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> addChannel(@RequestBody CreateChannel createChannel, @RequestHeader (HttpHeaders.AUTHORIZATION) String token) {
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        Staff staff = staffRepository.findOneByToken(token);

        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!RoleUtil.canViewProfileList(staff)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        try {
            Channel channel = ModelMapperUtils.mapper(createChannel, Channel.class);
            channel.setCreatedAt(LocalDateTime.now());
            channel.setUpdatedAt(LocalDateTime.now());
            channel.setCreatedBy(staff.getUserName());

            channelRepository.save(channel);
            return new ResponseEntity<>(channel, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.OK, Messages.ERROR),
                    HttpStatus.OK);
        }
    }

    @RequestMapping(value = { "/api/setting/updateChannel" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateChannel(@RequestBody UpdateChannel updateChannel, @RequestHeader (HttpHeaders.AUTHORIZATION) String token) {

        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!RoleUtil.canViewProfileList(staff)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Channel> channel = channelRepository.findById(updateChannel.getChannelId());
        if (channel.isPresent()) {
            return new ResponseEntity<>(channelService.updateChannel(channel.get(), updateChannel,staff), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Cv not found"), HttpStatus.OK);
        }

    }

    @RequestMapping(value = { "/api/setting/deleteChannel" }, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> deleteChannel(@RequestBody DeleteChannel deleteChannel, @RequestHeader (HttpHeaders.AUTHORIZATION) String token) {
        token = token.replace("Bearer ", "");
        token = StringUtils.hashString(token);
        Staff staff = staffRepository.findOneByToken(token);
        if (staff == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        if (!RoleUtil.canViewProfileList(staff)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        Optional<Channel> channel = channelRepository.findById(deleteChannel.getChannelId());
        if (channel.isPresent()) {
            channelRepository.delete(channel.get());
            return new ResponseEntity<>(channel.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>(new ApiMessage(HttpStatus.BAD_REQUEST, "Channel not found"), HttpStatus.OK);
        }
    }


}
