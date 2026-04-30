package com.coders.votingapp.controller;

import java.util.List;
import java.util.Map;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.coders.votingapp.entity.Poll;
import com.coders.votingapp.service.Pollservice;

@RestController
@RequestMapping("/polls")
@CrossOrigin("*")
public class Pollcontroller {

    private final Pollservice pollservice;

    public Pollcontroller(Pollservice pollservice) {
        this.pollservice = pollservice;
    }

    @GetMapping
    public List<Poll> getPolls() {
        return pollservice.getAllPolls();
    }

    @PostMapping
    public Poll createPoll(@RequestBody Poll poll) {
        return pollservice.createPoll(poll);
    }

    @PostMapping("/{id}/vote")
    public Poll vote(
            @PathVariable Long id,
            @RequestBody VoteRequest request
    ) {

        return pollservice.vote(id, request.getOptionIndex());
    }

    @DeleteMapping("/{id}")
    public Map<String, String> deletePoll(@PathVariable Long id) {

        pollservice.deletePoll(id);

        return Map.of(
                "message",
                "Poll deleted successfully"
        );
    }

    static class VoteRequest {

        private int optionIndex;

        public int getOptionIndex() {
            return optionIndex;
        }

        public void setOptionIndex(int optionIndex) {
            this.optionIndex = optionIndex;
        }
    }
}