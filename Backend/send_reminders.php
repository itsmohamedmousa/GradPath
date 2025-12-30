<?php
require __DIR__ . '/config/database_cli.php';
require __DIR__ . '/mail.php';

$sql = "
SELECT ce.id, ce.title, ce.description, ce.event_time, u.email
FROM Calendar_Event ce
JOIN User u ON ce.user_id = u.id
WHERE ce.reminder_time <= NOW()
AND ce.reminder_sent = 0
";

$stmt = $db->query($sql);
$events = $stmt->fetchAll();

foreach ($events as $event) {
    $sent = sendReminderEmail(
        $event['email'],
        $event['title'],
        $event['event_time'],
        $event['description']
    );

    if ($sent) {
        $update = $db->prepare("
            UPDATE Calendar_Event
            SET reminder_sent = 1
            WHERE id = ?
        ");
        $update->execute([$event['id']]);
    }
}
