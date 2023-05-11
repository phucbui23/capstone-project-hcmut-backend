import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createRoom(
    patientCode: string,
    doctorCode: string,
  ): Promise<{ roomId: string }> {
    const timestamp = new Date().toISOString();
    const roomData = {
      createdAt: timestamp,
      createdBy: '',
      members: [patientCode, doctorCode],
      recentMessages: {
        content: '',
        readBy: {
          sentAt: timestamp,
          sentBy: '',
        },
      },
    };

    const newRoomRef = collection(this.firebaseService.firestoreRef, 'rooms');
    const usersRef = collection(this.firebaseService.firestoreRef, 'users');

    let roomId: string;
    let patientDocId: string;
    let doctorDocId: string;

    const docRef = await addDoc(newRoomRef, roomData);
    roomId = docRef.id;

    // await addDoc(newRoomRef, roomData).then((doc) => {
    //   roomId = doc.id;
    // });

    await updateDoc(doc(this.firebaseService.firestoreRef, 'rooms', roomId), {
      id: roomId,
    });

    // create new roomMessges
    doc(this.firebaseService.firestoreRef, roomId, 'messages');

    // update user's room
    const patient = await getDocs(
      query(usersRef, where('id', '==', patientCode)),
    );

    patient.forEach((doc) => {
      patientDocId = doc.id;
    });

    await updateDoc(
      doc(this.firebaseService.firestoreRef, 'users', patientDocId),
      {
        rooms: arrayUnion(roomId),
      },
    );

    // update doctor's room
    const doctor = await getDocs(
      query(usersRef, where('id', '==', doctorCode)),
    );

    doctor.forEach((doc) => {
      doctorDocId = doc.id;
    });

    await updateDoc(
      doc(this.firebaseService.firestoreRef, 'users', doctorDocId),
      {
        rooms: arrayUnion(roomId),
      },
    );

    return { roomId: roomId };
  }

  async sendMsg(content: string, senderCode: string, roomId: string) {
    const user = await this.prismaService.userAccount.findUnique({
      where: { code: senderCode },
    });
    const senderName = `${user.firstName}` + ' ' + `${user.lastName}`;
    const timestamp = new Date().toISOString();
    const msgData = {
      roomId: roomId,
      content: content,
      sender: senderName,
      senderCode: senderCode,
      senAt: timestamp,
    };

    const newMsgRef = collection(
      this.firebaseService.firestoreRef,
      'roomMessages',
      roomId,
      'messages',
    );

    await addDoc(newMsgRef, msgData);

    // update recent message in room
    const roomRef = doc(this.firebaseService.firestoreRef, 'rooms', roomId);
    await updateDoc(roomRef, {
      'recentMessages.content': content,
    });

    return {
      roomId: roomId,
      content: content,
      sender: senderName,
      senderCode: senderCode,
      sentAt: timestamp,
    };
  }

  async getRooms(userCode: string) {
    const userSnap = await getDoc(
      doc(this.firebaseService.firestoreRef, 'users', userCode),
    );

    if (userSnap.exists()) {
      const userData = userSnap.data();
      const { rooms } = userData;

      const ret = [];

      for (const room of rooms) {
        const roomSnap = await getDoc(
          doc(this.firebaseService.firestoreRef, 'rooms', room),
        );
        ret.push(roomSnap.data());
      }

      ret.sort((a, b) => {
        return a.recentMessages.readBy.senAt < b.recentMessages.readBy.senAt
          ? -1
          : a.recentMessages.readBy.senAt > b.recentMessages.readBy.senAt
          ? 1
          : 0;
      });

      return ret;
    } else {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No conversations found.',
      });
    }
  }

  async getRoomMsg(roomId: string) {
    const messages = [];

    const querySnapshot = await getDocs(
      query(
        collection(
          this.firebaseService.firestoreRef,
          'roomMessages',
          roomId,
          'messages',
        ),
        where('roomId', '==', roomId),
      ),
    );

    querySnapshot.forEach((doc) => {
      if (doc) messages.push(doc.data());
    });

    messages.sort((a, b) => {
      return a.senAt > b.senAt ? -1 : a.senAt > b.senAt ? 1 : 0;
    });

    return { messages };
  }
}
