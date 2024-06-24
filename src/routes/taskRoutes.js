const express = require('express')
const Task = require('../models/Task')
const { checkToken } = require('../middleware/authMiddleware')

const router = express.Router()

router.delete('/incomplete', checkToken, async (req, res) => {
    try {
        console.log('Rota delete /tasks/incomplete acessada');
        const userId = req.userId;
        console.log('User ID:', userId);
        await Task.deleteMany({ user: userId, completed: false });
        res.status(200).json({ success: true, message: 'All incomplete tasks deleted successfully.' });
    } catch (error) {
        console.error('Error deleting all incomplete tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.delete('/complete', checkToken, async (req, res) => {
    try {
        console.log('Rota delete /tasks/complete acessada'); 
        const userId = req.userId;
        console.log('User ID:', userId); 
        await Task.deleteMany({ user: userId, completed: true });
        res.status(200).json({ success: true, message: 'All complete tasks deleted successfully.' });
    } catch (error) {
        console.error('Error deleting all complete tasks:', error);
        res.status(500).json({ success: false, error: 'Internal server error.' });
    }
});

router.post('/', checkToken, async (req, res) => {
    try {
        const task = new Task({
            ...req.body,
            user: req.userId 
        })
        await task.save()
        res.status(201).send(task)
    } catch (error) {
        res.status(400).send(error)
    }
})


router.get('/', checkToken, async (req, res) => {
    try {
        const tasks = await Task.find({ user: req.userId })
        res.status(200).send(tasks)
    } catch (error) {
        res.status(500).send(error)
    }
})


router.get('/:id', checkToken, async (req, res) => {
    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})

router.patch('/:id', checkToken, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }

    try {
        const task = await Task.findOne({ _id: req.params.id, user: req.userId });
        if (!task) {
            return res.status(404).send();
        }

        updates.forEach(update => task[update] = req.body[update]);

        
        if (updates.includes('completed')) {
            if (req.body.completed) {
                task.completedAt = new Date();
            } else {
                task.completed = false;
                task.completedAt = null;
            }
        }

        await task.save();

        res.status(200).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});


router.delete('/:id', checkToken, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId })
        if (!task) {
            return res.status(404).send()
        }
        res.status(200).send(task)
    } catch (error) {
        res.status(500).send(error)
    }
})




module.exports = router
