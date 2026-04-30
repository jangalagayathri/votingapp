package com.coders.votingapp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.stereotype.Service;

import com.coders.votingapp.entity.Poll;

@Service
public class Pollservice {

    private final List<Poll> polls = new ArrayList<>();

    private Long currentId = 1L;

    // Get all polls
    public List<Poll> getAllPolls() {
        return polls;
    }

    // Create poll
    public Poll createPoll(Poll poll) {

        poll.setId(currentId++);

        poll.setCreatedAt(LocalDateTime.now());

        poll.getOptions().forEach(option -> {
            option.setVotes(0);
        });

        polls.add(poll);

        return poll;
    }

    // Vote on poll
    public Poll vote(Long pollId, int optionIndex) {

        Poll poll = polls.stream()
                .filter(p -> p.getId().equals(pollId))
                .findFirst()
                .orElseThrow();

        Poll.Option option =
                poll.getOptions().get(optionIndex);

        option.setVotes(option.getVotes() + 1);

        return poll;
    }

    // Delete poll
    public void deletePoll(Long pollId) {

        polls.removeIf(
                poll -> poll.getId().equals(pollId)
        );
    }
}
